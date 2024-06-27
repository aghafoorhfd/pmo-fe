import React, { useEffect, useState } from 'react';
import {
  Form, Input, Modal, notification
} from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const UpgradePackageModal = (props) => {
  const {
    showModal, onCloseModal, existingNumberOfLicenses, onUpgradeEnterprisePlan, processing
  } = props;
  const [numberOfLicenses, setNumberOfLicenses] = useState(existingNumberOfLicenses);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const layout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 }
  };

  useEffect(() => {
    form.setFieldsValue({ licenses: numberOfLicenses });
  }, []);

  const onUpgradePackage = () => {
    if (numberOfLicenses <= existingNumberOfLicenses) {
      notification.error({ message: t('component.billing.cycle.upgrade.license.message') });
      return;
    }
    onUpgradeEnterprisePlan(numberOfLicenses);
  };

  const onCancel = () => {
    form.resetFields();
    onCloseModal(false);
  };

  const modalContent = (
    <Form form={form} layout={layout}>
      <Form.Item
        label={t('component.billing.cycle.modal.licensesInput.label')}
        name="licenses">
        <Input onWheel={(e) => e.target.blur()} onChange={(e) => setNumberOfLicenses(e.target.value)} type="number" value={numberOfLicenses} min={1} placeholder={t('component.billing.cycle.modal.licensesInput.placeholder')} />
      </Form.Item>
    </Form>
  );

  return (
    <Modal
      title={t('component.billing.cycle.upgrade.modal.title')}
      open={showModal}
      onOk={onUpgradePackage}
      cancelButtonProps={{ disabled: processing }}
      okButtonProps={{ disabled: processing }}
      confirmLoading={processing}
      onCancel={onCancel}
      okText={t('component.billing.cycle.modal.okText')}
      cancelText={t('component.billing.cycle.modal.cancelText')}>
      {modalContent}
    </Modal>
  );
};

UpgradePackageModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  existingNumberOfLicenses: PropTypes.number.isRequired,
  onUpgradeEnterprisePlan: PropTypes.func.isRequired,
  processing: PropTypes.bool.isRequired
};

export default UpgradePackageModal;
