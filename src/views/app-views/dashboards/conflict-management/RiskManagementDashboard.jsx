import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, Row, Form, Spin, notification, Modal
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import {
  addNewRisk, filters, hideMessage, getRiskList, updateRiskDetails, resetConflictStore,
  resetPagination
} from 'store/slices/riskManagementSlice';

import { STATUS } from 'constants/StatusConstant';
import { CONFLICT_ACTIONS } from 'constants/MiscConstant';

import { Card } from 'components/shared-components/Card';
import Table from 'components/shared-components/DataTable/index';
import BasicTabs from 'components/shared-components/Tabs';
import { noop } from 'lodash';
import { ACCESS_TYPES } from 'constants/AccessTypes';
import Details from './conflict-details/index';
import { getOpenConflictColumns } from './data-table-config/open-risk';
import { getResolvedConflictColumns } from './data-table-config/resolved-risk';
import { getCanceledConflictColumns } from './data-table-config/canceled-risk';

import './conflict-details/Styles.css';

const { SUCCESS } = STATUS;

function RiskManagementDashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { confirm } = Modal;
  const { OPENED, RESOLVED, CANCELLED } = CONFLICT_ACTIONS;

  const {
    riskManagement: {
      conflictsList: { data: { totalElements = 0, content = [] } = {} },
      conflictsDetails: { data: detailList = {} } = {},
      filter: { pageNumber, pageSize },
      loading,
      message,
      showMessage,
      status
    },
    auth: {
      userProfile: { accessType, email }
    }
  } = useSelector((state) => ({
    riskManagement: state.riskManagement,
    auth: state.auth
  }));

  const [selectedTab, setSelectedTab] = useState(OPENED);
  const [showDetails, setShowDetails] = useState(false);
  const [conflictForm] = Form.useForm();
  const [conflictDetailId, setConflictDetailId] = useState();
  const [checkForms, setCheckForm] = useState(false);

  useEffect(() => {
    dispatch(getRiskList({ riskStatus: selectedTab, pageNumber, pageSize }));
  }, [selectedTab]);

  const resetToInitialStates = () => {
    conflictForm.resetFields();
    setConflictDetailId(null);
    setShowDetails(false);
    setCheckForm(false);
  };

  useEffect(() => {
    if (showMessage) {
      notification[status]({ message });
      const timer = setTimeout(() => dispatch(hideMessage()), 3000);
      if (status === SUCCESS) {
        dispatch(getRiskList({ riskStatus: selectedTab, pageNumber: 1, pageSize: 10 }));
        resetToInitialStates();
      }
      return () => {
        clearTimeout(timer);
      };
    }
  }, [showMessage]);

  useEffect(() => () => {
    dispatch(resetConflictStore());
  }, []);

  const onTabChange = (key) => {
    if (key !== selectedTab) {
      dispatch(resetPagination());
      setSelectedTab(key);
    }
  };

  const formatter = (data) => {
    if (typeof data[0] === 'string') {
      return data;
    }
    return data?.map(({ value }) => value);
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
      dispatch(getRiskList({ riskStatus: selectedTab, pageNumber, pageSize }));
    }
  };

  const handleResolveConflict = () => {
    conflictForm.validateFields().then((values) => {
      const {
        createdDate,
        createdBy,
        conflictStatus,
        daysOpen,
        impactedMemberIds,
        impactedOtherProjectIds,
        impactedTeamIds,
        projectId,
        ...formValues
      } = values;

      dispatch(updateRiskDetails({
        ...formValues,
        conflictStatus: RESOLVED,
        impactedMemberIds: formatter(impactedMemberIds),
        impactedOtherProjectIds: formatter(impactedOtherProjectIds),
        impactedTeamIds: formatter(impactedTeamIds),
        projectId: formatter(projectId).toString()
      }));

      resetToInitialStates();
    });
  };

  const handleCancelConflict = () => {
    conflictForm.validateFields().then((values) => {
      const {
        createdDate,
        createdBy,
        conflictStatus,
        daysOpen,
        impactedMemberIds,
        impactedOtherProjectIds,
        impactedTeamIds,
        projectId,
        ...formValues
      } = values;

      dispatch(updateRiskDetails({
        ...formValues,
        conflictStatus: CANCELLED,
        impactedMemberIds: formatter(impactedMemberIds),
        impactedOtherProjectIds: formatter(impactedOtherProjectIds),
        impactedTeamIds: formatter(impactedTeamIds),
        projectId: formatter(projectId).toString()
      }));

      resetToInitialStates();
    });
  };

  const isDetailsPageOpened = () => (conflictDetailId);
  const isManagerHasAccess = () => (
    accessType === ACCESS_TYPES.PROJECT_MANAGER && detailList.createdBy !== email);

  const handleSubmit = () => {
    conflictForm.validateFields().then((values) => {
      if (isDetailsPageOpened() && values.conflictId) {
        const {
          createdDate,
          createdBy,
          daysOpen,
          conflictNotes,
          impactedMemberIds,
          impactedOtherProjectIds,
          impactedTeamIds,
          projectId,
          ...formValues
        } = values;

        dispatch(updateRiskDetails({
          ...formValues,
          conflictNotes: conflictNotes || null,
          impactedMemberIds: formatter(impactedMemberIds),
          impactedOtherProjectIds: formatter(impactedOtherProjectIds),
          impactedTeamIds: formatter(impactedTeamIds),
          projectId: formatter(projectId).toString()
        }));
      } else if (!values.conflictId) {
        const { conflictId, ...formValues } = values;
        dispatch(addNewRisk(formValues));
      }
    }).catch(() => noop());
  };

  const conflictActionButtons = () => {
    if (selectedTab === OPENED && isDetailsPageOpened()) {
      return (
        [
          {
            disable: isManagerHasAccess(),
            key: t('component.conflict.manager.button.cancelRisk'),
            action: handleCancelConflict,
            block: true,
            label: t('component.conflict.manager.button.cancelRisk'),
            id: 'conflict-form-cancel-btn'
          },
          {
            disable: isManagerHasAccess(),
            key: t('component.conflict.manager.button.resolveRisk'),
            action: handleResolveConflict,
            block: true,
            label: t('component.conflict.manager.button.resolveRisk'),
            type: 'primary',
            id: 'conflict-form-resolve-btn'
          }
        ]
      );
    }
  };

  const handleChange = (pagination) => {
    const { current, pageSize: size } = pagination;
    dispatch(filters({
      conflictStatus: selectedTab, pageNumber: current, pageSize: size
    }));
  };

  const tableLoading = {
    spinning: loading,
    indicator: <Spin />
  };

  const renderColumns = () => {
    if (selectedTab === OPENED) return getOpenConflictColumns(handleConflictDetails);
    if (selectedTab === RESOLVED) return getResolvedConflictColumns(handleConflictDetails);
    return getCanceledConflictColumns(handleConflictDetails);
  };

  const renderTable = () => (
    <Table
      id="conflictId"
      data-i="open-conflict-tbl"
      columns={renderColumns()}
      data={content}
      currentPage={pageNumber}
      pageSize={pageSize}
      handleChange={handleChange}
      loading={tableLoading}
      showPagination
      totalElements={totalElements}
      scrollXWidth={1500} />
  );

  const getMainTabs = () => [
    {
      label: t('component.conflict.manager.tab.openRisk'),
      key: OPENED,
      children: renderTable()
    },
    {
      label: t('component.conflict.manager.tab.resolvedRisk'),
      key: RESOLVED,
      children: renderTable()
    },
    {
      label: t('component.conflict.manager.tab.cancelledRisk'),
      key: CANCELLED,
      children: renderTable()
    }
  ];

  const operations = () => (
    <Row>
      <Button
        id="open-new-conflict-btn"
        type="primary"
        disabled={selectedTab !== OPENED}
        onClick={() => {
          setShowDetails(true);
        }}>
        {t('component.conflict.manager.button.openNewRisk')}
      </Button>
    </Row>
  );

  return (
    <div data-i="conflict-manager-dashboard-screen">
      {showDetails ? (
        <Details
          conflictForm={conflictForm}
          conflictDetailId={conflictDetailId}
          conflictActionButtons={conflictActionButtons()}
          handleSubmit={handleSubmit}
          isDetailsPageOpened={isDetailsPageOpened()}
          setCheckForm={setCheckForm}
          selectedTab={selectedTab}
          onClose={onClose}
          checkForms={checkForms} />
      ) : (
        <Card
          heading={t('component.conflict.manager.heading')}
          description={t('component.conflict.manager.description')}
          actionBtn={operations()}
          bordered={false}
          tagText={`${totalElements} ${t('component.project.manager.chart1.title')}`}
          showBorder>
          <BasicTabs
            pillShaped
            items={getMainTabs()}
            onTabChange={onTabChange}
            selectedTab={selectedTab} />
        </Card>
      )}
    </div>
  );
}

export default RiskManagementDashboard;
