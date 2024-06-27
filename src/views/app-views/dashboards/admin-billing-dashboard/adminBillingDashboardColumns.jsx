import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

export const adminBillingDashboardColumns = (editHandler) => {
  const { t } = useTranslation();
  return (
    [
      {
        key: 'clientName',
        dataIndex: 'clientName',
        title: t('component.admin.billing.dashboard.table.column.clientName'),
        width: 130
      },
      {
        key: 'clientType',
        dataIndex: 'clientType',
        title: t('component.admin.billing.dashboard.table.column.clientType'),
        width: 140
      },
      {
        key: 'product',
        dataIndex: 'product',
        title: t('component.admin.billing.dashboard.table.column.product'),
        width: 90
      },
      {
        key: 'dateActivated',
        dataIndex: 'dateActivated',
        title: t('component.admin.billing.dashboard.table.column.dateActivated'),
        width: 130
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: t('component.common.status.label'),
        width: 130
      },
      {
        key: 'billingCycle',
        dataIndex: 'billingCycle',
        title: t('component.admin.billing.dashboard.table.column.billingCycle'),
        width: 130
      },
      {
        key: 'rate',
        dataIndex: 'rate',
        title: t('component.admin.billing.dashboard.table.column.rate'),
        width: 130
      },
      {
        key: 'nextBillingDate',
        dataIndex: 'nextBillingDate',
        title: t('component.admin.billing.dashboard.table.column.nextBillingDate'),
        width: 130
      },
      {
        key: 'activeUsers',
        dataIndex: 'activeUsers',
        title: t('component.admin.billing.dashboard.table.column.activeUsers'),
        width: 130
      },
      {
        key: 'revenue',
        dataIndex: 'revenue',
        title: t('component.admin.billing.dashboard.table.column.revenue'),
        width: 130
      },
      {
        title: '',
        dataIndex: 'revoke',
        key: 'revoke',
        render: (_, record) => (
          <Button
            type="secondary"
            onClick={() => editHandler(record)}>
            {t('component.common.edit.label')}
          </Button>
        )
      }
    ]
  );
};
