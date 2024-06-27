import React from 'react';
import Modal from 'components/shared-components/Modal';
import { Form, Input, notification } from 'antd';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { useTranslation } from 'react-i18next';
import ResourceService from 'services/ResourceService';

const ResourceAssignmentRejectModal = ({
  isModalOpen,
  onClose,
  handleResourceAssignment,
  resourceRequestId
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const { reason } = form.getFieldsValue();
      const payload = {
        rejectReason: reason || ''
      };
      await ResourceService.rejectResourceCapacity(resourceRequestId, payload);
      notification.success({ message: t('component.resource.manager.resources.reject.modal.success') });
      handleResourceAssignment();
    } catch ({ message }) {
      notification.error({ message });
    }
  };
  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const getActionButtons = () => [
    {
      action: 'close',
      block: true,
      colSpan: 12,
      label: t('component.project.manager.resources.reject.modal.secondaryBtnText'),
      type: 'default'
    },
    {
      action: form.submit,
      block: true,
      colSpan: 12,
      label: t('component.project.manager.resources.reject.modal.okBtnText'),
      type: 'primary'
    }];

  const rules = {
    reason: [
      {
        required: true,
        message: t('component.resource.manager.resources.rejectForm.reason.required')
      }
    ]
  };

  return (
    <Modal
      destroyOnClose
      forceRender
      open={isModalOpen}
      onOk={form.submit}
      footer={null}
      onCancel={handleClose}
      secondaryActionsButtons={getActionButtons()}>
      <h4 className="mb-4 text-center">{t('component.project.manager.resources.reject.modal.infoText')}</h4>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical">
        <Form.Item name="reason" rules={rules.reason} label={t('component.project.manager.resources.reject.input.label.reason')}>
          <Input.TextArea id="reject-request-reason" placeholder={t('component.project.manager.resources.reject.input.placeholder.reason')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ResourceAssignmentRejectModal;

ResourceAssignmentRejectModal.propTypes = {
  isModalOpen: PropTypes.bool,
  selectedSprint: PropTypes.shape({
    name: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string
  }),
  onClose: PropTypes.func,
  resourceRequestId: PropTypes.string.isRequired,
  handleResourceAssignment: PropTypes.func
};
ResourceAssignmentRejectModal.defaultProps = {
  isModalOpen: false,
  selectedSprint: {},
  onClose: noop,
  handleResourceAssignment: noop
};
