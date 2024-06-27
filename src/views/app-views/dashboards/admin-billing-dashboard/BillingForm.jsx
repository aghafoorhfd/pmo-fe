/* eslint-disable no-console */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form, DatePicker, Select,
  Input
} from 'antd';
import PropTypes from 'prop-types';

const BillingForm = (props) => {
  const { form, setIsFormTouched, handleSubmit } = props;
  const { t } = useTranslation();
  const { Option } = Select;
  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      data-i="admin-billing-form"
      onFieldsChange={() => {
        setIsFormTouched(true);
      }}>
      <Form.Item name="clientName" label={t('component.admin.billing.dashboard.clientName.input.label')} rules={[{ required: true }]}>
        <Select allowClear getPopupContainer={(trigger) => trigger.parentElement} placeholder={t('component.admin.billing.dashboard.clientName.placeholder')}>
          <Option value="client1">Client 1</Option>
          <Option value="client2">Client 2</Option>
          <Option value="client3">Client 3</Option>
        </Select>
      </Form.Item>
      <Form.Item name="clientType" label={t('component.admin.billing.dashboard.clientType.input.label')} rules={[{ required: true }]}>
        <Select allowClear getPopupContainer={(trigger) => trigger.parentElement} placeholder={t('component.admin.billing.dashboard.clientType.placeholder')}>
          <Option value="type1">Type 1</Option>
          <Option value="type2">Type 2</Option>
          <Option value="type3">Type 3</Option>
        </Select>
      </Form.Item>
      <Form.Item name="product" label={t('component.admin.billing.dashboard.product.input.label')} rules={[{ required: true }]}>
        <Select allowClear getPopupContainer={(trigger) => trigger.parentElement} placeholder={t('component.admin.billing.dashboard.product.placeholder')}>
          <Option value="product1">Product 1</Option>
          <Option value="product2">Product 2</Option>
          <Option value="product3">Product 3</Option>
        </Select>
      </Form.Item>
      <Form.Item name="dateActivated" label={t('component.admin.billing.dashboard.dateActivated.input.label')} rules={[{ required: true }]}>
        <DatePicker getPopupContainer={(trigger) => trigger.parentElement} className="w-100" format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item name="status" label={t('component.common.status.label')} rules={[{ required: true }]}>
        <Input placeholder={t('component.common.status.label')} />
      </Form.Item>
      <Form.Item name="billingCycle" label={t('component.admin.billing.dashboard.billingCycle.input.label')} rules={[{ required: true }]}>
        <Select allowClear getPopupContainer={(trigger) => trigger.parentElement} placeholder={t('component.admin.billing.dashboard.billingCycle.placeholder')}>
          <Option value="cycle1">Cycle 1</Option>
          <Option value="cycle2">Cycle 2</Option>
          <Option value="cycle3">Cycle 3</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="rate"
        label={t('component.admin.billing.dashboard.rate.input.label')}
        rules={[{ required: true },
          () => ({
            validator(_, value) {
              if (value < 0) {
                return Promise.reject(new Error(t('component.admin.billing.dashboard.input.label.validation.length')));
              }
              return Promise.resolve();
            }
          })
        ]}>
        <Input type="number" placeholder={t('component.admin.billing.dashboard.rate.input.label')} />
      </Form.Item>
      <Form.Item name="nextBillingDate" label={t('component.admin.billing.dashboard.nextBillingDate.input.label')} rules={[{ required: true }]}>
        <DatePicker getPopupContainer={(trigger) => trigger.parentElement} className="w-100" format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="activeUsers"
        label={t('component.admin.billing.dashboard.activeUsers.input.label')}
        rules={[{ required: true },
          () => ({
            validator(_, value) {
              if (value < 0) {
                return Promise.reject(new Error(t('component.admin.billing.dashboard.input.label.validation.length')));
              }
              return Promise.resolve();
            }
          })
        ]}>
        <Input type="number" placeholder={t('component.admin.billing.dashboard.activeUsers.input.label')} />
      </Form.Item>
      <Form.Item
        name="revenue"
        label={t('component.admin.billing.dashboard.revenue.input.label')}
        rules={[{ required: true },
          () => ({
            validator(_, value) {
              if (value < 0) {
                return Promise.reject(new Error(t('component.admin.billing.dashboard.input.label.validation.length')));
              }
              return Promise.resolve();
            }
          })
        ]}>
        <Input type="number" placeholder={t('component.admin.billing.dashboard.revenue.input.label')} />
      </Form.Item>
    </Form>
  );
};

BillingForm.propTypes = {
  setIsFormTouched: PropTypes.func.isRequired
};

export default BillingForm;
