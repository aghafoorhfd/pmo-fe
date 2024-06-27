import { Card } from 'components/shared-components/Card';
import BasicBar from 'components/shared-components/Charts/BarChart';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const ProjectPriorityOutlook = () => {
  const { t } = useTranslation();

  const mockData = [
    { range: 10, label: 'Urgent', color: '#FF1F11' },
    { range: 28, label: 'High', color: '#FF9B63' },
    { range: 90, label: 'Medium High', color: '#9A3EF7' },
    { range: 40, label: 'Medium', color: '#63FFF6' },
    { range: 25, label: 'Low', color: '#039855' }
  ];
  const colors = [];
  const ranges = [];
  const labels = [];

  mockData.forEach((outlook) => {
    colors.push(outlook.color);
    labels.push(outlook.label);
    ranges.push(outlook.range);
  });

  return (
    <Card heading={t('component.executive.dashboard.heading.projectPriorityOutlook')} showBorder>
      <div style={{ height: '300px' }}>
        <BasicBar
          data-i="outlook-bar-chart"
          categories={labels}
          multiColorBars
          data={ranges}
          color={colors}
          name={t('component.executive.dashboard.total')} />
      </div>
    </Card>
  );
};
