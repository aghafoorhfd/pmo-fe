import React from 'react';
import { useTranslation } from 'react-i18next';

import BasicBar from 'components/shared-components/Charts/BarChart';
import { Card } from 'components/shared-components/Card';

export const ProjectOutlook = () => {
  const { t } = useTranslation();
  const mockData = [
    { range: 10, label: 'No Risk', color: '#039855' },
    { range: 28, label: 'Low Risk', color: '#C9AA05' },
    { range: 90, label: 'Medium Risk', color: '#983802' },
    { range: 40, label: 'Medium Heigh Risk', color: '#FF9B63' },
    { range: 25, label: 'Elevated Risk', color: '#FF1F11' }
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
    <Card heading={t('component.executive.dashboard.heading.projectRiskOutlook')} showBorder>
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
