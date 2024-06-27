import React, { useEffect, useState } from 'react';
import {
  Col, Row, Modal, Form
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { CONFLICT_ACTIONS, MY_CONFLICT_STATUS } from 'constants/MiscConstant';
import {
  getMonitoredStats, getTaggedRiskList,
  getTaggedStats, hideMessage, resetPagination, updateRiskDetails
} from 'store/slices/riskManagementSlice';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { noop } from 'lodash';
import { STATUS } from 'constants/StatusConstant';
import TaggedRiskChart from './data-widget/TaggedRiskChart';
import MonitoredRiskChart from './data-widget/MonitoredRiskChart';
import TaggedConflictCard from './TaggedRiskCard';
import MonitoredRiskCard from './MonitoredRiskCard';
import Details from '../../conflict-management/conflict-details';

const MyRisks = () => {
  const { t } = useTranslation();
  const { IMPACTED, PINNED } = MY_CONFLICT_STATUS;
  const dispatch = useDispatch();
  const [checkForms, setCheckForm] = useState(false);
  const [conflictDetailId, setConflictDetailId] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTab, setSelectedTab] = useState(
    CONFLICT_ACTIONS.OPENED
  );
  const [conflictForm] = Form.useForm();
  const { confirm } = Modal;
  const {
    riskManagement: {
      taggedConflicts: {
        loading,
        data: { totalElements = 0, content = [] },
        filter: { pageNumber, pageSize }
      },
      showMessage,
      status
    },
    auth: {
      userProfile: { id, accessType }
    }
  } = useSelector((state) => ({
    riskManagement: state.riskManagement,
    auth: state.auth
  }));
  const { SUCCESS } = STATUS;
  const isDetailsPageOpened = () => (conflictDetailId);
  const impactedMemberIdEncoded = encodeURIComponent(`impactedMemberIds|${id}`);

  const resetToInitialStates = () => {
    conflictForm.resetFields();
    setConflictDetailId(null);
    setShowDetails(false);
    setCheckForm(false);
  };

  useEffect(() => () => {
    dispatch(hideMessage());
  });

  useEffect(() => {
    if (showMessage && status === SUCCESS) {
      dispatch(getTaggedRiskList({
        pageNumber: 1,
        pageSize: 10,
        selectedTab,
        filterOr: impactedMemberIdEncoded
      }));
      resetToInitialStates();
      dispatch(hideMessage());
    }
  }, [showMessage]);

  useEffect(() => {
    dispatch(getTaggedStats({ conflictStatus: IMPACTED }));
    dispatch(getMonitoredStats({ conflictStatus: PINNED }));
  }, []);

  const onTabChange = (key) => {
    if (key !== selectedTab) {
      dispatch(resetPagination());
      setSelectedTab(key);
    }
  };

  const formatter = (data) => data?.map((d) => d?.value || d);

  const handleSubmit = () => {
    conflictForm.validateFields().then((values) => {
      if (isDetailsPageOpened() && values.conflictId) {
        const {
          createdDate,
          createdBy,
          daysOpen,
          impactedMemberIds,
          impactedOtherProjectIds,
          impactedTeamIds,
          projectId,
          ...formValues
        } = values;

        dispatch(updateRiskDetails({
          ...formValues,
          impactedMemberIds: formatter(impactedMemberIds),
          impactedOtherProjectIds: formatter(impactedOtherProjectIds),
          impactedTeamIds: formatter(impactedTeamIds),
          projectId: formatter(projectId).toString()
        }));
      }
    }).catch(() => noop());
  };

  const handleConflictDetails = (conflictId) => {
    setConflictDetailId(conflictId);
    setShowDetails(true);
  };

  const showConfirm = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h5>{t('component.message.unsavedChanges')}</h5>,
      onOk() {
        resetToInitialStates();
      }
    });
  };

  const onClose = () => {
    if (checkForms) {
      showConfirm();
    } else {
      resetToInitialStates();
      dispatch(getTaggedRiskList({
        pageNumber, pageSize, selectedTab, filterOr: impactedMemberIdEncoded
      }));
    }
  };

  return (
    showDetails ? (
      <Details
        conflictForm={conflictForm}
        conflictDetailId={conflictDetailId}
        setCheckForm={setCheckForm}
        selectedTab={selectedTab}
        onClose={onClose}
        handleSubmit={handleSubmit}
        isDetailsPageOpened={isDetailsPageOpened}
        accessType={accessType}
        checkForms={checkForms} />
    ) : (
      <>
        <Row gutter={[32]}>
          <Col span={12}>
            <TaggedRiskChart />
          </Col>
          <Col span={12}>
            <MonitoredRiskChart />
          </Col>
        </Row>
        <TaggedConflictCard
          id={id}
          content={content}
          totalElements={totalElements}
          loading={loading}
          onTabChange={onTabChange}
          handleConflictDetails={handleConflictDetails}
          selectedTab={selectedTab}
          pageNumber={pageNumber}
          pageSize={pageSize} />
        <MonitoredRiskCard id={id} handleConflictDetails={handleConflictDetails} />
      </>
    )
  );
};

export default MyRisks;
