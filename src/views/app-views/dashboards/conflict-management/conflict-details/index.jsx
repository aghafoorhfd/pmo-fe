import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row, Typography, Button, Form, notification
} from 'antd';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/shared-components/Card';

import { useDispatch, useSelector } from 'react-redux';
import {
  getProjectNamesList, getTeamNamesList, getUsersList,
  getImpactedOtherProjects, getRiskDetails, getRiskHistoryDetails, hideMessage
} from 'store/slices/riskManagementSlice';

import { ACCESS_TYPES } from 'constants/AccessTypes';
import RisktInfo from './RisktInfo';
import RisktHistory from './RisktHistory';
import RiskImpact from './RiskImpact';

import './Styles.css';
import RiskComment from './RiskComment';

const { Text, Title } = Typography;

const Details = ({
  conflictForm,
  setCheckForm,
  conflictDetailId,
  handleSubmit,
  selectedTab,
  onClose,
  conflictActionButtons,
  isDetailsPageOpened,
  accessType,
  checkForms
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    riskManagement: {
      message,
      showMessage,
      status
    }
  } = useSelector((state) => ({
    riskManagement: state.riskManagement
  }));

  const [selectedProjectId, setSelectedProjectId] = useState();
  const isUserHasAccess = () => {
    if (accessType && (accessType === ACCESS_TYPES.GENERAL_USER
      || ACCESS_TYPES.RESOURCE_MANAGER)) return true;
  };

  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
  };
  useEffect(() => {
    if (conflictDetailId) {
      dispatch(getRiskDetails(conflictDetailId));
      dispatch(getRiskHistoryDetails(conflictDetailId));
    }
    dispatch(getProjectNamesList());
    dispatch(getUsersList());
    dispatch(getTeamNamesList());
    dispatch(getImpactedOtherProjects());
  }, [conflictDetailId]);

  useEffect(() => {
    if (isUserHasAccess() && showMessage) {
      notification[status]({ message });
      dispatch(hideMessage());
    }
  }, [showMessage]);

  return (
    <div className="conflict-details-container">
      <Card className="card-container">
        <Row className="d-flex justify-content-between align-items-center">
          <Col span={21}>
            <Title level={2}>{!conflictDetailId ? t('component.conflict.manager.details.main.heading.openNewRisk') : t('component.conflict.manager.details.edit.heading')}</Title>
            <Text>{!conflictDetailId ? t('component.conflict.manager.details.subHeading') : t('component.conflict.manager.details.edit.subHeading')}</Text>
          </Col>
          <Col span={3} className="d-flex justify-content-end buttons">
            {
              conflictActionButtons?.map((items) => (
                <Button
                  key={items.key}
                  block={items.block}
                  onClick={items.action}
                  disabled={items.disable}
                  type={items.type}
                  id={items.id}>
                  {items?.label}
                </Button>
              ))
            }
          </Col>
        </Row>
      </Card>
      <Form
        name="conflict"
        layout="horizontal"
        labelAlign="left"
        labelCol={{
          span: 7
        }}
        wrapperCol={{
          span: 17
        }}
        form={conflictForm}
        onFieldsChange={() => { setCheckForm(true); }}
        onFinish={handleSubmit}>
        <Card
          className="card-container"
          heading={t('component.conflict.manager.details.card1.heading.riskDetails')}>
          <RisktInfo
            conflictForm={conflictForm}
            conflictDetailId={conflictDetailId}
            selectedTab={selectedTab}
            onChangeProject={handleProjectChange} />
        </Card>
        <Card
          className="card-container"
          heading={t('component.conflict.manager.details.card1.heading.riskImpacts')}>
          <RiskImpact
            selectedTab={selectedTab}
            selectedProjectId={selectedProjectId}
            conflictForm={conflictForm}
            conflictDetailId={conflictDetailId}
            isUserHasAccess={isUserHasAccess()} />
        </Card>
        {
        conflictDetailId && (
        <Card className="card-container" heading={t('component.conflict.manager.details.conflictHistory')}>
          <RisktHistory />
        </Card>
        )
      }
        <RiskComment
          selectedTab={selectedTab}
          onClose={onClose}
          handleSubmit={handleSubmit}
          isDetailsPageOpened={isDetailsPageOpened}
          isUserHasAccess={isUserHasAccess()}
          checkForms={checkForms} />
      </Form>
    </div>
  );
};

Details.propTypes = {
  setCheckForm: PropTypes.func.isRequired,
  conflictDetailId: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  selectedTab: PropTypes.string
};

Details.defaultProps = {
  conflictDetailId: '',
  selectedTab: 'OPENED'
};

export default Details;
