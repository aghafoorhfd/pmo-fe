import React, { useState } from 'react';
import {
  Form, Input, Select, Radio, notification, DatePicker
} from 'antd';
import { useTranslation } from 'react-i18next';
import Modal from 'components/shared-components/Modal/index';
import { currencyList } from 'constants/Currency';
import SubscriptionService from 'services/SubscriptionService';
import moment from 'moment';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';
import { B2BMonthlyPackage, B2BProductId } from 'constants/PricingPackagesConstant';

export default function ProductAdminForm(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isFormTouched, setIsFormTouched] = useState(false);

  const { Option } = Select;

  const {
    isModalOpen, setIsModalOpen
  } = props;

  const handleSubmit = async (values) => {
    const {
      planType, companyName, amountPerLicense, currencyCode,
      email, firstName, lastName, noOfLicenses, billingDate
    } = values;

    try {
      const planPayload = {
        planType,
        currencyCode,
        noOfLicenses,
        amountPerLicense,
        customer: {
          firstName,
          lastName,
          email,
          companyName
        },
        productId: B2BProductId,
        planPackageDiscountRanges: B2BMonthlyPackage,
        billingDate: moment(billingDate).format(DATE_FORMAT_DD_MM_YYYY)
      };

      await SubscriptionService.addPlan(planPayload);
      notification.success({ message: t('component.product.admin.success.message') });
      form.resetFields();
      setIsModalOpen(false);
    } catch (err) {
      notification.error({ message: err?.message });
    }
  };

  const onClose = () => {
    form.resetFields();
    setIsModalOpen(false);
    setIsFormTouched(false);
  };

  const rules = {
    planType: [
      {
        required: true,
        message: t('component.product.admin.plan.type.required')
      }
    ],
    companyName: [
      {
        required: true,
        message: t('component.product.admin.company.name.required')
      }
    ],
    currencyCode: [
      {
        required: true,
        message: t('component.product.admin.currency.required')
      }
    ],
    noOfLicenses: [
      {
        required: true,
        message: t('component.product.admin.licenses.required')
      },
      () => ({
        validator(_, value) {
          if (value < 50) {
            return Promise.reject(new Error(t('component.product.admin.licenses.limit')));
          }
          return Promise.resolve();
        }
      })
    ],
    amountPerLicense: [
      {
        required: true,
        message: t('component.product.admin.amount.required')
      }
    ],
    firstName: [
      {
        required: true,
        message: t('component.product.admin.customer.firstName.required')
      }
    ],
    lastName: [
      {
        required: true,
        message: t('component.product.admin.customer.lastName.required')
      }
    ],
    email: [
      {
        required: true,
        message: t('component.product.admin.customer.email.required')
      }
    ],
    duration: [
      {
        required: true,
        message: t('component.product.admin.plan.duration.required')
      }
    ],
    billingDate: [
      {
        required: true,
        message: t('component.product.admin.billingDate.required')
      }
    ]
  };

  const productAdminForm = () => (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      name="product-admin-form"
      data-i="product-admin-form"
      onFieldsChange={() => {
        setIsFormTouched(true);
      }}>
      <Form.Item name="planType" label={t('component.product.admin.plan.type')} rules={rules.planType}>
        <Select
          placeholder={t('component.product.admin.plan.type.placeholder')}>
          <Option value="B2B">B2B</Option>
        </Select>
      </Form.Item>

      <Form.Item
        data-i="form-item-teamName"
        name="companyName"
        label={t('component.product.admin.company.name')}
        rules={rules.companyName}
        hasFeedback>
        <Input data-i="form-input-teamName" allowClear placeholder={t('component.product.admin.company.name.placeholder')} />
      </Form.Item>
      <Form.Item name="currencyCode" label={t('component.product.admin.currency')} rules={rules.currencyCode}>
        <Select
          showSearch
          name="currencyCode"
          data-i="form-item-accessType-inputField"
          allowClear
          placeholder={t('component.product.admin.currency.placeholder')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
          options={currencyList} />
      </Form.Item>

      <Form.Item
        data-i="form-item-teamName"
        name="noOfLicenses"
        label={t('component.product.admin.licenses')}
        rules={rules.noOfLicenses}
        hasFeedback>
        <Input
          type="number"
          data-i="form-input-teamName"
          allowClear
          placeholder={t('component.product.admin.licenses.placeholder')} />
      </Form.Item>
      <Form.Item
        data-i="form-item-teamName"
        name="amountPerLicense"
        label={t('component.product.admin.amount')}
        rules={rules.amountPerLicense}
        hasFeedback>
        <Input type="number" data-i="form-input-teamName" allowClear placeholder={t('component.product.admin.amount.placeholder')} />
      </Form.Item>
      <Form.Item
        data-i="form-item-teamName"
        name="firstName"
        label={t('component.product.admin.customer.firstName')}
        rules={rules.firstName}
        hasFeedback>
        <Input data-i="form-input-teamName" allowClear placeholder={t('component.product.admin.customer.firstName.placeholder')} />
      </Form.Item>
      <Form.Item
        data-i="form-item-teamName"
        name="lastName"
        label={t('component.product.admin.customer.lastName')}
        rules={rules.lastName}
        hasFeedback>
        <Input data-i="form-input-teamName" allowClear placeholder={t('component.product.admin.customer.lastName.placeholder')} />
      </Form.Item>
      <Form.Item
        data-i="form-item-teamName"
        name="email"
        label={t('component.product.admin.customer.email')}
        rules={rules.email}
        hasFeedback>
        <Input data-i="form-input-teamName" allowClear placeholder={t('component.product.admin.customer.email.placeholder')} />
      </Form.Item>

      <Form.Item name="duration" label={t('component.product.admin.plan.duration')} rules={rules.duration}>
        <Radio.Group>
          <Radio value="monthly">{t('component.product.admin.monthly')}</Radio>
          <Radio value="yearly">{t('component.product.admin.yearly')}</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="billingDate"
        label={t('component.product.admin.billingDate')}
        rules={rules.billingDate}>
        <DatePicker className="w-100" placeholder={t('component.product.admin.billingDate.placeholder')} disabledDate={(current) => current && current <= moment().startOf('day')} />
      </Form.Item>
    </Form>
  );

  return (
    <Modal
      isFullScreen
      forceRender
      data-i="product-admin-form-modal"
      title={t('component.addProfile')}
      isOpen={isModalOpen}
      confirmOnCancel={isFormTouched}
      onCancel={onClose}
      okText={t('component.common.save.label')}
      onOk={form.submit}>
      {productAdminForm()}
    </Modal>
  );
}
