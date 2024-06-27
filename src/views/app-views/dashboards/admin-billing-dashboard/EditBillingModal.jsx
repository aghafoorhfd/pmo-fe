import React, { useState } from 'react';
import Modal from 'components/shared-components/Modal/index';
import { useTranslation } from 'react-i18next';
import {
  Form
} from 'antd';
import PropTypes from 'prop-types';
import BillingForm from './BillingForm';

const EditBillingModal = (props) => {
  const { open, onCloseModal, billingRecord } = props;
  const { t } = useTranslation();
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [form] = Form.useForm();

  const handleFormSubmission = () => {
    form.validateFields().then(() => {
      form.resetFields();
      onCloseModal();
    }).catch((info) => { throw info; });
  };

  const handleOnCancel = () => {
    form.resetFields();
    onCloseModal();
    setIsFormTouched(false);
  };

  return (
    <Modal
      title={t('component.admin.billing.dashboard.modal.title')}
      isOpen={open}
      onCancel={handleOnCancel}
      confirmOnCancel={isFormTouched}
      okText={billingRecord ? t('component.common.update.label') : t('component.common.add.label')}
      onOk={form.submit}>
      <BillingForm
        form={form}
        handleSubmit={handleFormSubmission}
        setIsFormTouched={setIsFormTouched} />
    </Modal>
  );
};

EditBillingModal.propTypes = {
  open: PropTypes.bool.isRequired
};

export default EditBillingModal;
