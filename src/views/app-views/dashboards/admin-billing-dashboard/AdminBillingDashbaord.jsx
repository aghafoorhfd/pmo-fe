import { PlusCircleOutlined } from '@ant-design/icons';
import {
  Button, PageHeader, Row, Spin
} from 'antd';
import DataTable from 'components/shared-components/DataTable';
import { AdminBillingDashbaordData } from 'mock/data/adminBillingDashboardData';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminBillingDashboardColumns } from './adminBillingDashboardColumns';
import EditBillingModal from './EditBillingModal';

const tableLoading = {
  spinning: false,
  indicator: <Spin />
};

const AdminBillingDashboard = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [billingRecord, setBillingRecord] = useState(null);

  const handleEditClick = (record) => {
    setShowModal(true);
    setBillingRecord(record);
  };
  const handleAddBillingClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBillingRecord(null);
  };

  return (
    <>
      <Row justify="space-between" align="middle">
        <PageHeader className="pl-2" title={t('component.admin.billing.dashboard.title')} />
        <Button type="primary" onClick={handleAddBillingClick}>
          <PlusCircleOutlined />
          {t('component.admin.billing.dashboard.button.label')}
        </Button>
      </Row>
      <DataTable
        data-i="adminBillingDashboard"
        data={AdminBillingDashbaordData}
        columns={adminBillingDashboardColumns(handleEditClick)}
        id="id"
        loading={tableLoading}
        showPagination
        totalElements={10} />

      <EditBillingModal
        open={showModal}
        onCloseModal={handleCloseModal}
        billingRecord={billingRecord} />
    </>
  );
};

export default AdminBillingDashboard;
