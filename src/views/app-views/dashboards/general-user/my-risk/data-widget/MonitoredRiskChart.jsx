import { Card } from 'components/shared-components/Card';
import DonutChartWidget from 'components/shared-components/DonutChartWidget';
import { useSelector } from 'react-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Empty } from 'antd';
import Loading from 'components/shared-components/Loading';
import { calculateTotalCount, capitalize } from 'utils/utils';

const MonitoredRiskChart = () => {
  const { t } = useTranslation();
  const {
    riskManagement: {
      monitoredConflicts: {
        monitoredStats,
        monitoredStatsLoading
      }
    }
  } = useSelector((state) => ({
    riskManagement: state.riskManagement
  }));
  const totalMonitoredCount = calculateTotalCount(monitoredStats);

  return (
    <Card
      heading={t('component.general.user.monitored.conflicts.title')}
      tagText={`${totalMonitoredCount} ${t('component.general.user.conflicts.label')}`}
      description={t('component.general.user.conflicts.details')}
      showBorder>
      <div style={{ height: '350px' }} className="align-content-lg-center">
        {monitoredStatsLoading && <Loading />}
        {monitoredStats?.length > 0 ? (
          <DonutChartWidget
            series={monitoredStats?.map((item) => item.count)}
            labels={monitoredStats?.map((item) => capitalize(item.id.toLowerCase()))}
            customOptions={
                 {
                   colors: ['#039855', '#F79009', '#DC143C'],
                   legend: {
                     show: true,
                     position: 'right',
                     offsetY: 50,
                     offsetX: 0
                   }
                 }
         } />
        ) : <Empty />}
      </div>
    </Card>
  );
};

export default MonitoredRiskChart;
