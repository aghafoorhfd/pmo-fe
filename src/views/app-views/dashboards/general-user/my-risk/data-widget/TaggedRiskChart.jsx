import { Card } from 'components/shared-components/Card';
import DonutChartWidget from 'components/shared-components/DonutChartWidget';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Empty } from 'antd';
import Loading from 'components/shared-components/Loading';
import { calculateTotalCount, capitalize } from 'utils/utils';

const TaggedRiskChart = () => {
  const { t } = useTranslation();
  const {
    riskManagement: {
      taggedConflicts: {
        taggedStats,
        taggedStatsLoading
      }
    }
  } = useSelector((state) => ({
    riskManagement: state.riskManagement
  }));
  const totalTaggedCount = calculateTotalCount(taggedStats);
  return (
    <Card
      heading={t('component.general.user.tagged.conflicts.title')}
      tagText={`${totalTaggedCount} ${t('component.general.user.conflicts.label')}`}
      description={t('component.general.user.conflicts.details')}
      showBorder>
      <div style={{ height: '350px' }} className="align-content-lg-center">
        {taggedStatsLoading && <Loading />}
        {taggedStats.length > 0
          ? (
            <DonutChartWidget
              series={taggedStats.map((item) => item.count)}
              labels={taggedStats.map((item) => capitalize(item.id.toLowerCase()))}
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

export default TaggedRiskChart;
