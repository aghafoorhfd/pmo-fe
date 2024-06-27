import {
  Empty, notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import '../MyProjects.css';
import ChartWidget from 'components/shared-components/ChartWidget';
import { Card } from 'components/shared-components/Card';
import { useTranslation } from 'react-i18next';
import { checkProjectRange } from 'utils/utils';
import ProjectService from 'services/ProjectService';
import Loading from 'components/shared-components/Loading';
import { methodologyType } from 'constants/ProjectMetricsConstant';

const SprintAllocationWidget = ({ cadenceType, quarterSprintData, sprints }) => {
  const { t } = useTranslation();
  const [workAllocation, setWorkAllocation] = useState([]);
  const [workAllocationSeries, setWorkAllocationSeries] = useState([]);
  const [workAllocationLoading, setWorkAllocationLoading] = useState(true);

  const allocationChartOptions = {
    chart: {
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '80%'
      }
    },
    grid: {
      show: false
    },
    markers: {
      shape: 'circle'
    },
    legend: {
      showForSingleSeries: true,
      position: 'top'
    }
  };

  const getSprintAllocation = async () => {
    try {
      const { data } = await ProjectService.getStatsForSprintAndProjects();
      setWorkAllocation(data);
    } catch (err) {
      notification.error({ message: err.message });
    } finally {
      setWorkAllocationLoading(false);
    }
  };

  useEffect(() => {
    getSprintAllocation();
  }, []);

  const processSprintWorkAllocation = (sprintsData) => workAllocation
    .filter(({ projectCadence }) => projectCadence === cadenceType)
    .map(({ projectName, resourcesDetails }) => {
      const data = [];
      resourcesDetails?.forEach(({ fromDate, toDate, capacity }) => {
        sprintsData.forEach(({ startDate, endDate }, index) => {
          const isProjectDateInRange = checkProjectRange(startDate, endDate, fromDate, toDate);
          const resourceAvailableCapacity = isProjectDateInRange ? capacity : 0;
          data[index] = (data[index] || 0) + resourceAvailableCapacity;
        });
      });
      return { name: projectName, data };
    });

  useEffect(() => {
    if ((quarterSprintData?.length > 0 || sprints?.length > 0)
    && workAllocation?.length > 0 && cadenceType) {
      const sprintData = cadenceType === methodologyType.AGILE_CAPS ? sprints : quarterSprintData;
      const allocationSeries = processSprintWorkAllocation(sprintData);
      setWorkAllocationSeries(allocationSeries);
    }
  }, [sprints, workAllocation, quarterSprintData, cadenceType]);

  const getCategoriesByName = () => {
    const categoryType = cadenceType === methodologyType.AGILE_CAPS ? sprints : quarterSprintData;
    return categoryType.map(({ name }) => name);
  };

  return (
    <Card
      heading={t('component.general.user.project.allocation.sprint.title')}
      description={t('component.general.user.project.status.widget.details')}
      className="user-project-stat-bar"
      showBorder>
      <div style={{ height: '300px' }}>
        {workAllocationLoading && <Loading />}
        {workAllocationSeries?.length > 0 && (
        <ChartWidget
          series={workAllocationSeries}
          height={300}
          card={false}
          type="bar"
          customOptions={{
            xaxis: {
              categories: getCategoriesByName()
            },
            ...allocationChartOptions
          }} />
        ) }
        {workAllocationSeries?.length === 0
        && !workAllocationLoading && <Empty />}
      </div>
    </Card>
  );
};

export default SprintAllocationWidget;
