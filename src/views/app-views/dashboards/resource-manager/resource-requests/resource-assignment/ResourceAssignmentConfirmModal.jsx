import React, { useState } from 'react';
import Modal from 'components/shared-components/Modal';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { useTranslation } from 'react-i18next';
import ResourceService from 'services/ResourceService';
import { notification } from 'antd';
import ResourceAssignmentRejectModal from './ResourceAssignmentRejectModal';

const ResourceAssignmentConfirmModal = ({
  isModalOpen,
  onClose,
  request,
  selectedResource,
  handleResourceAssignment
}) => {
  const {
    resourceRequestId,
    resourceRequestDetail: {
      capacity
    }
  } = request;
  const {
    resourceId, firstName, lastName, email, designation: resourceDiscipline
  } = selectedResource;
  const { t } = useTranslation();

  const [isRejectModalOpen, showRejectModal] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const onReject = () => {
    handleClose();
    showRejectModal(true);
  };

  const onRejectModalClose = () => {
    showRejectModal(false);
  };

  const onAssign = async () => {
    const payload = {
      status: 'ASSIGNED',
      assignedResourceDetailDTO: {
        id: resourceId,
        name: `${firstName} ${lastName}`,
        email,
        resourceDiscipline,
        capacity
      }
    };
    try {
      await ResourceService.assignResourceCapacity(resourceRequestId, payload);
      notification.success({ message: t('component.project.manager.resources.confirm.modal.success') });
      handleResourceAssignment();
    } catch ({ message }) {
      notification.error({ message });
      handleClose();
    }
  };

  const getActionButtons = () => [
    {
      action: onReject,
      block: true,
      colSpan: 12,
      label: t('component.project.manager.resources.confirm.modal.secondaryBtnText'),
      type: 'default'
    },
    {
      action: onAssign,
      block: true,
      colSpan: 12,
      label: t('component.project.manager.resources.confirm.modal.okBtnText'),
      type: 'primary'
    }
  ];

  return (
    <>
      <Modal
        destroyOnClose
        forceRender
        open={isModalOpen}
        footer={null}
        onCancel={handleClose}
        secondaryActionsButtons={getActionButtons()}>
        <h4 className="mb-4 text-center">{t('component.project.manager.resources.confirm.modal.infoText')}</h4>
      </Modal>
      <ResourceAssignmentRejectModal
        isModalOpen={isRejectModalOpen}
        resourceRequestId={resourceRequestId}
        onClose={onRejectModalClose}
        handleResourceAssignment={handleResourceAssignment} />

    </>
  );
};
export default ResourceAssignmentConfirmModal;

ResourceAssignmentConfirmModal.propTypes = {
  isModalOpen: PropTypes.bool,
  selectedSprint: PropTypes.shape({
    name: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string
  }),
  selectedResource: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    teamCapacity: PropTypes.number,
    availableCapacity: PropTypes.number,
    assignedStartDate: PropTypes.string,
    assignedEndDate: PropTypes.string
  }),
  onClose: PropTypes.func,
  handleResourceAssignment: PropTypes.func
};
ResourceAssignmentConfirmModal.defaultProps = {
  isModalOpen: false,
  selectedResource: {},
  selectedSprint: {},
  onClose: noop,
  handleResourceAssignment: noop
};
