import React from 'react';
import { Card } from 'components/shared-components/Card';
import { useTranslation } from 'react-i18next';
import { Empty } from 'antd';
import DonutChartWidget from 'components/shared-components/DonutChartWidget';

const ResourceAllocationDonutChart = ({ stats }) => {
  const { t } = useTranslation();
  const initialState = { committed: 0, open: 0 };
  const mappedStatsData = stats ? Object.values(stats)
    .reduce((prevStat, currStat) => ({
      committed: prevStat.committed + currStat.committed,
      open: prevStat.open + currStat.open
    }), initialState) : [initialState];

  return (
    <Card
      heading={t('component.project.manager.resources.chart.heading')}
      description={t('component.project.manager.resources.chart.description')}
      showBorder>
      <div style={{ height: '350px' }} className="align-content-lg-center">
        {stats && Object.keys(stats)?.length ? (
          <DonutChartWidget
            height={230}
            series={[mappedStatsData.committed, mappedStatsData.open]}
            labels={[
              t('component.resource.manager.resource.chart.label.committed'),
              t('component.resource.manager.resource.chart.label.openRequests')
            ]}
            customOptions={
            {
              colors: ['#F79009', '#039855'],
              legend: {
                show: true,
                position: 'right',
                offsetY: 50,
                offsetX: 0,
                onItemHover: {
                  highlightDataSeries: false
                }
              }
            }
            } />
        ) : <Empty />}
      </div>
    </Card>
  );
};

export default ResourceAllocationDonutChart;
