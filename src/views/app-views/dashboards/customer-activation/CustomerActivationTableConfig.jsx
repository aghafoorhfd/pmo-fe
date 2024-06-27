import { PLAN_STATUS } from 'constants/MiscConstant';
import i18n from 'i18next';
import moment from 'moment';

const { t } = i18n;
export const getColumns = () => [
  {
    title: t('component.analytics.table.column.profileType'),
    children: [
      {
        title: t('component.analytics.table.column.profileType.type'),
        dataIndex: 'planType',
        key: 'planType',
        width: 131
      },
      {
        title: t('component.analytics.table.column.profileType.name'),
        dataIndex: 'customerName',
        key: 'customerName',
        width: 131,
        render: (_, record) => {
          const { customer } = record;
          return `${customer[0]?.firstName} ${customer[0]?.lastName}`;
        }
      },
      {
        title: t('component.analytics.table.column.profileType.activate'),
        dataIndex: 'billingDate',
        key: 'billingDate',
        width: 131,
        render: (_, record) => {
          const { billingDate } = record;
          return moment(billingDate).format('DD/MM/YYYY');
        }
      }
    ]
  },
  {
    title: t('component.analytics.table.column.billing'),
    className: 'billing-column',
    children: [
      {
        title: t('component.common.status.label'),
        dataIndex: 'status',
        key: 'status',
        className: 'billing-column',
        width: 131,
        render: (_, record) => {
          const { status } = record;
          return PLAN_STATUS[status];
        }
      },
      {
        title: t('component.analytics.table.column.billing.billingCycle'),
        dataIndex: 'billingCycle',
        key: 'billingCycle',
        className: 'billing-column',
        width: 131,
        render: (_, record) => {
          const { planPackages } = record;
          return planPackages[0]?.planPaymentCycle;
        }
      }
    ]
  },
  {
    title: t('component.analytics.table.column.license'),
    align: 'center',
    children: [
      {
        align: 'center',
        title: t('component.analytics.table.column.license.count'),
        dataIndex: 'noOfLicences',
        key: 'noOfLicences',
        width: 131
      }
    ]
  }
];
