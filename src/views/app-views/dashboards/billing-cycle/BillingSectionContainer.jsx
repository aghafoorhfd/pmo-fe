import React from 'react';
import BillingProfile from './BillingProfile';

const BillingSectionContainer = ({
  billingCycleLoader, companyData, activeSubscription
}) => (
  <BillingProfile
    companyData={companyData}
    billingCycleLoader={billingCycleLoader}
    activeSubscription={activeSubscription} />
);

export default BillingSectionContainer;
