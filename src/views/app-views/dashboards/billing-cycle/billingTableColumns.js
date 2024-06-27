import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';
import moment from 'moment';
import i18n from 'i18next';
import { getRemainingLicenses } from 'utils/utils';
import { BILLING_OPTIONS } from 'constants/MiscConstant';

const { t } = i18n;

export const billingTableColumns = () => (
  [
    {
      key: 'label',
      dataIndex: 'label',
      title: '',
      width: '50%'
    },
    {
      key: 'data',
      dataIndex: 'data',
      title: t('component.billing.cycle.modal.packageInput.label'),
      width: '50%'
    }
  ]
);

export const getSubscriptionsBillingTableColumns = () => (
  [
    {
      align: 'center',
      key: 'invoiceDate',
      dataIndex: 'invoiceDate',
      title: t('component.resource.request.column.date'),
      render: (_, record) => moment(record?.invoiceDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH)
    },
    {
      align: 'center',
      key: 'totalAmount',
      dataIndex: 'totalAmount',
      title: t('component.billing.amount'),
      render: (_, record) => `$${record?.totalAmount.toFixed(2)}`
    },
    {
      align: 'center',
      key: 'billingCycle',
      dataIndex: 'billingCycle',
      title: t('component.billing.payment.plan')
    }
  ]
);
export const getPackageDetailsData = (companyData, activeSubscription) => (
  [
    {
      label: t('component.billing.cycle.packageName.title'),
      data: activeSubscription?.planName || t('component.common.notAvailable')
    },
    {
      label: t('component.billing.total.contracted.licenses'),
      data: companyData?.totalLicenses || 0
    },
    {
      label: t('component.billing.utilized.licenses'),
      data: companyData?.usedLicenses || 0
    },
    {
      label: t('component.billing.available.licenses'),
      data: getRemainingLicenses(companyData) || 0
    },
    {
      label: t('component.billing.license.type'),
      data: activeSubscription?.planPaymentCycle || t('component.common.notAvailable')
    },
    {
      label: t('component.billing.billing.date'),
      data: activeSubscription?.nextBillingDate && activeSubscription?.planPaymentCycle !== BILLING_OPTIONS.FREE ? moment(activeSubscription?.nextBillingDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH) : t('component.common.notAvailable')
    },
    {
      label: t('component.billing.billing.rate'),
      data: activeSubscription?.totalAmountPerMonth ? `$${activeSubscription?.totalAmountPerMonth.toFixed(2) || ''}` : t('component.common.notAvailable')
    }
  ]
);
