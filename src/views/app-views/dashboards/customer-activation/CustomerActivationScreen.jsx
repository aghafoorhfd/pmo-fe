import React, { useEffect, useState } from 'react';
import {
  Row, Col, Typography, Card, Spin, Button, Form, notification
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import SubscriptionService from 'services/SubscriptionService';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';
import { B2BMonthlyPackage, B2BProductId, B2BYearlyPackage } from 'constants/PricingPackagesConstant';

// Helper components
import { getAllB2BCustomersPlansList, filters } from 'store/slices/customerActivationSlice';
import DataTable from 'components/shared-components/DataTable';
import { useTranslation } from 'react-i18next';
import { getColumns } from './CustomerActivationTableConfig';
import './customer-activation-styles.css';
import AddNewProfileFormModal from './addNewProfileFormModal';

export default function CustomerActivationScreen() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [addProfileForm] = Form.useForm();
  const [showAddProfileFormModal, setShowAddProfileFormModal] = useState(false);

  const {
    loading,
    customersList: {
      data: { totalElements, content = [] } = {}
    },
    filter: { pageNumber, pageSize }
  } = useSelector((state) => state.customerActivation);

  const { Title } = Typography;

  useEffect(() => {
    dispatch(getAllB2BCustomersPlansList());
  }, []);

  const tableLoading = {
    spinning: loading,
    indicator: <Spin />
  };

  const addProfileOnOk = async (formValue) => {
    const planPayload = {
      customer: {
        companyName: formValue?.companyName,
        email: formValue?.email,
        firstName: formValue?.firstName,
        lastName: formValue?.lastName
      },
      noOfLicenses: formValue?.noOfLicenses,
      planType: formValue?.planType,
      currencyCode: 'USD',
      billingDate: moment(formValue?.billingDate).format(DATE_FORMAT_DD_MM_YYYY),
      amountPerLicense: formValue?.amountPerLicense,
      productId: B2BProductId,
      planPackageDiscountRanges: formValue?.billingCycle === 'monthly' ? B2BMonthlyPackage : B2BYearlyPackage
    };
    try {
      await SubscriptionService.addPlan(planPayload);
      addProfileForm.resetFields();
      notification.success({ message: t('component.product.admin.success.message') });
      dispatch(getAllB2BCustomersPlansList());
      setShowAddProfileFormModal(false);
    } catch (error) {
      notification.error({ message: error?.message });
    }
  };

  const handleChange = (pagination) => {
    const { current, pageSize: size } = pagination;
    dispatch(filters({ pageNumber: current, pageSize: size }));
  };
  return (
    <>
      <Row align="middle" className="ml-2 mb-3" justify="space-between">
        <Col>
          <Title className="mb-0" strong level={3}>{t('component.customer.activation.heading')}</Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => setShowAddProfileFormModal(true)}>
            {t('component.customer.activation.addNewProfile')}
          </Button>
        </Col>
      </Row>
      <Card className="product-admin-table-container">
        <DataTable
          id="subscriptionId"
          data-i="customerActivationTable"
          columns={getColumns()}
          scroll={{ y: 475 }}
          bordered
          handleChange={handleChange}
          data={content}
          currentPage={pageNumber}
          pageSize={pageSize}
          loading={tableLoading}
          showPagination
          totalElements={totalElements} />
      </Card>
      <AddNewProfileFormModal
        form={addProfileForm}
        open={showAddProfileFormModal}
        onCancel={() => setShowAddProfileFormModal(false)}
        onOk={addProfileOnOk} />
    </>
  );
}
