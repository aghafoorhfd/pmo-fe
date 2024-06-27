import { Card } from 'components/shared-components/Card';
import BasicBar from 'components/shared-components/Charts/BarChart';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const ProjectPriorityOverview = () => {
  const { t } = useTranslation();

  const mockData = [
    { range: 200, label: 'Tech Priority' },
    { range: 40, label: 'Business Priority' },
    { range: 300, label: 'Revenue Priority' },
    { range: 60, label: 'Growth Priority' },
    { range: 10, label: 'Competitor Advantage' }
  ];
  const ranges = [];
  const labels = [];

  mockData.forEach((outlook) => {
    labels.push(outlook.label);
    ranges.push(outlook.range);
  });

  return (
    <Card heading={t('component.executive.dashboard.heading.projectPriorityOverview')} showBorder>
      <div style={{ height: '300px' }}>
        <BasicBar
          data-i="outlook-bar-chart"
          categories={labels}
          data={ranges}
          name={t('component.executive.dashboard.total')} />
      </div>
    </Card>
  );
};
