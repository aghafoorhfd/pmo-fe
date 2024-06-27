import { useTranslation } from 'react-i18next';

export const pendingInvoiceTableColumns = () => {
  const { t } = useTranslation();
  return (
    [
      {
        title: t('component.product.admin.organization.name'),
        dataIndex: 'organizationName',
        key: 'organizationName',
        render: (_, record) => record?.customer?.organizationName.toUpperCase()
      },
      {
        title: t('component.billing.profile.total.license'),
        dataIndex: 'totalLicenses',
        key: 'totalLicenses'
      },
      {
        title: t('component.billing.profile.total.amount'),
        dataIndex: 'totalAmountToBeCharged',
        key: 'totalAmountToBeCharged'
      },
      {
        title: t('component.addNewProfile.form.modal.popup.status'),
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: t('component.billing.profile.total.invoice.status'),
        dataIndex: 'invoiceStatus',
        key: 'invoiceStatus'
      },
      {
        title: t('component.billing.payment.plan'),
        dataIndex: 'paymentPlan',
        key: 'paymentPlan'
      }
    ]
  );
};
