import React from 'react';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

import { Card } from 'components/shared-components/Card';
import DonutChartWidget from 'components/shared-components/DonutChartWidget';
import Loading from 'components/shared-components/Loading';

export const GlobalProjectDonutChart = (props) => {
  const { userStatsLoading } = props;
  const { t } = useTranslation();

  return (
    <Card
      heading={t('component.executive.dashboard.heading.globalProjectStatus')}
      showBorder>
      <div style={{ height: '300px' }}>
        {userStatsLoading ? (<Loading />) : null}
        {!userStatsLoading && Object.keys([]) ? (
          <DonutChartWidget
            series={[30, 70]}
            labels={['Hold on Project', 'Active Project']}
            customOptions={{
              colors: ['#F40000', '#039855'],
              legend: {
                show: true,
                position: 'right',
                offsetY: 50,
                offsetX: 100,
                onItemHover: {
                  highlightDataSeries: false
                }
              }
            }} />
        ) : (<Empty />)}
      </div>
    </Card>
  );
};
