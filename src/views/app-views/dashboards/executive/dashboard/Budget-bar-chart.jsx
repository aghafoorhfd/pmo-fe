import { Card } from 'components/shared-components/Card';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const BudgetChart = () => {
  const { t } = useTranslation();
  return (
    <Card heading={t('component.executive.dashboard.heading.projectBudget')} showBorder>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div style={{ transform: 'rotate(-30deg)', fontSize: '23px' }}>
          <p>Coming Soon</p>
        </div>
      </div>
    </Card>
  );
};
