import IntlMessage from 'components/util-components/IntlMessage';

export const getBillingCycleTableColumns = () => [
  {
    title: <IntlMessage id="component.billing.cycle.packageName.title" />,
    dataIndex: 'packageName',
    key: 'packageName',
    width: 130
  },
  {
    title: <IntlMessage id="component.billing.cycle.packageDetails.title" />,
    dataIndex: 'packageDetails',
    key: 'packageDetails',
    width: 250
  },
  {
    title: <IntlMessage id="component.billing.cycle.lastBillingDate.title" />,
    dataIndex: 'lastBillingDate',
    key: 'lastBillingDate',
    width: 200
  },
  {
    title: <IntlMessage id="component.billing.cycle.dueBillingDate.title" />,
    dataIndex: 'dueBillingDate',
    key: 'dueBillingDate',
    width: 130
  }
];
