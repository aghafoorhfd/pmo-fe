import { Card } from 'components/shared-components/Card';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRemainingLicenses, scrollIntoColumn } from 'utils/utils';
import { Button } from 'antd';
import LicensesUsageChart from './data-widgets/LicensesUsageChart';
import LicensesSummary from './data-widgets/LicensesSummary';

const BillingProfile = ({ companyData, billingCycleLoader, activeSubscription }) => {
  const { t } = useTranslation();
  const [conflictChartData, setConflictChartData] = useState({
    series: [],
    label: []
  });

  useEffect(() => {
    if (companyData) {
      setConflictChartData({
        series: [companyData.usedLicenses, getRemainingLicenses(companyData)],
        label: [t('component.common.used'), t('component.common.remaining')]
      });
    }
  }, [companyData]);

  const handleClick = () => {
    scrollIntoColumn('billing-details');
  };

  return (
    <Card loading={billingCycleLoader} actionBtn={(<Button type="link" className="font-weight-bold" onClick={handleClick} id="view-billing-details">{t('component.billing.details.label')}</Button>)} heading={t('component.billing.profile.heading')} description={t('component.billing.profile.description')} showBorder>
      <div style={{ height: '26rem' }}>
        <LicensesUsageChart chartData={conflictChartData} />
        {!billingCycleLoader && (
          <LicensesSummary
            companyData={companyData}
            activeSubscription={activeSubscription} />
        )}
      </div>
    </Card>
  );
};

export default BillingProfile;
