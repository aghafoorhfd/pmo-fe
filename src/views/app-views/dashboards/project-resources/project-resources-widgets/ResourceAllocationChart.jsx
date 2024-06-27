import React, { useEffect, useState, useRef } from 'react';
import ChartWidget from 'components/shared-components/ChartWidget';
import { Card } from 'components/shared-components/Card';
import { useTranslation } from 'react-i18next';
import { shortDesignations } from 'constants/MiscConstant';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { Empty } from 'antd';

const ResourceAllocationChart = ({ stats }) => {
  const { t } = useTranslation();

  const [resourceDesignation, setResourceDesignation] = useState({});
  const [transformedResourceAllocation, setTransformedResourceAllocation] = useState([]);
  const [resourceAllocation, setResourceAllocation] = useState([]);
  const [max, setMax] = useState(0);
  const menuRef = useRef(null);

  const resourceAllocationSeriesLabels = {
    committed: t('component.resource.manager.resource.chart.label.committed'),
    open: t('component.resource.manager.resource.chart.label.openRequests')
  };

  const resetInitialState = () => {
    setTransformedResourceAllocation([]);
    setResourceAllocation([]);
  };

  const findTotalValue = (data) => {
    let totalMax = 1;
    data.forEach((obj) => {
      if (obj.selected) {
        totalMax += obj.max;
      }
    });
    return totalMax;
  };

  const transformResourceAllocation = (projectResourceAllocation) => {
    const totalMax = findTotalValue(projectResourceAllocation);
    const transformedArray = projectResourceAllocation.map((value) => ({
      name: value.name,
      data: value.data
    }));
    return { transformedArray, totalMax };
  };

  const prepareResourceAllocationData = () => {
    const projectResourceAllocation = [];
    const designations = {
      longNames: [],
      shortNames: []
    };
    Object.entries(stats).forEach(([key, value]) => {
      designations.longNames.push(key);
      designations.shortNames.push(shortDesignations[key] || key.slice(0, 2).toUpperCase());

      Object.entries(value).forEach(([keys, values]) => {
        const updatedKey = resourceAllocationSeriesLabels[keys];
        const existingIndex = projectResourceAllocation.findIndex((item) => item.name
        === updatedKey);
        if (existingIndex === -1) {
          const existingSeries = resourceAllocation.find((oldSeries) => oldSeries.name
          === updatedKey);
          projectResourceAllocation.push({
            name: updatedKey,
            data: [],
            max: 0,
            selected: existingSeries ? existingSeries.selected : true
          });
        }
        const indexToUpdate = existingIndex !== -1 ? existingIndex
          : projectResourceAllocation.length - 1;
        projectResourceAllocation[indexToUpdate].data.push(values);
        projectResourceAllocation[indexToUpdate].max = Math.max(
          projectResourceAllocation[indexToUpdate].max,
          values
        );
      });
    });
    return { designations, projectResourceAllocation };
  };

  const setChartData = () => {
    if (Object.keys(stats)?.length > 0) {
      const { designations, projectResourceAllocation } = prepareResourceAllocationData();
      setResourceDesignation(designations);
      setResourceAllocation([...projectResourceAllocation]);

      const { transformedArray, totalMax } = transformResourceAllocation(projectResourceAllocation);
      setMax(totalMax);
      setTransformedResourceAllocation(transformedArray);
    } else {
      resetInitialState();
    }
  };

  useEffect(() => {
    setChartData();
  }, [stats]);

  const handleLegendClick = (seriesIndex) => {
    const updatedAllocationData = cloneDeep(resourceAllocation);
    updatedAllocationData[seriesIndex].selected = !updatedAllocationData[seriesIndex].selected;
    const totalMax = findTotalValue(updatedAllocationData);
    setMax(totalMax);
    setResourceAllocation(updatedAllocationData);
  };
  return (
    <Card
      heading={t('component.project.manager.resources.chart.heading')}
      description={t('component.project.manager.resources.chart.description')}
      showBorder>
      <div style={{ height: '350px' }} className="align-content-lg-center">
        {transformedResourceAllocation.length > 0 ? (
          <div ref={menuRef}>
            <ChartWidget
              height={230}
              card={false}
              type="bar"
              series={transformedResourceAllocation}
              xAxis={resourceDesignation.shortNames}
              customOptions={{
                yaxis: [
                  {
                    max,
                    forceNiceScale: true,
                    labels: {
                      formatter(val) {
                        return val.toFixed(0);
                      }
                    }
                  }
                ],
                chart: {
                  stacked: true,
                  events: {
                    legendClick(_, seriesIndex) {
                      handleLegendClick(seriesIndex);
                    }
                  }
                },
                fill: {
                  colors: ['#039855', '#F79009']
                },
                legend: {
                  position: 'bottom',
                  markers: {
                    fillColors: ['#039855', '#F79009']
                  }
                },
                tooltip: {
                  custom({ dataPointIndex }) {
                    return resourceDesignation.longNames[dataPointIndex];
                  }
                }
              }} />
          </div>
        ) : <Empty />}
      </div>
    </Card>

  );
};

ResourceAllocationChart.propTypes = {
  stats: PropTypes.shape({})
};
ResourceAllocationChart.defaultProps = {
  stats: {}
};

export default ResourceAllocationChart;
