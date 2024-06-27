import Modal from 'components/shared-components/Modal';
import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import {
  Button,
  Card, Col, Row, Typography
} from 'antd';
import { useTranslation } from 'react-i18next';
import { projectData } from 'mock/data/resourceRequests';
import ResourceCapacity from './ResourceCapacity';

const ResourceAssignmentModal = ({ isVisible, onClose }) => {
  const { t } = useTranslation();
  const { Text } = Typography;

  return (
    <Modal isOpen={isVisible} onCancel={onClose} width={1000} title={t('component.resource.request.modal.heading')}>
      <Card>
        <Row gutter={[16, 4]}>
          <Col span={6}>
            <Text strong>{t('component.project.manager.project.details.label.projectName')}</Text>
            <Text className="ml-2">{projectData.projectName}</Text>
          </Col>
          <Col />
          <Col>
            <Text strong>{t('component.project.manager.resources.form.label.resourceType')}</Text>
            <Text className="ml-2">{projectData.resourceType}</Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button type="link" className="pl-0">{t('component.resource.request.capacity.link')}</Button>
          </Col>
        </Row>
      </Card>
      <Card data-i="resource-capacity-availability">
        <ResourceCapacity />
      </Card>
    </Modal>
  );
};

export default ResourceAssignmentModal;

ResourceAssignmentModal.propTypes = {
  onClose: PropTypes.func,
  isVisible: PropTypes.bool
};

ResourceAssignmentModal.defaultProps = {
  onClose: noop,
  isVisible: false
};
