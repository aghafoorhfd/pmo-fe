import React, { useState, useEffect } from 'react';
import {
  AutoComplete,
  Button,
  Col, Input, notification, Row, Tag, Typography
} from 'antd';
import { PushpinOutlined } from '@ant-design/icons';

import { searchIcon } from 'assets/svg/icon';
import { Card } from 'components/shared-components/Card';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useFirstRender from 'utils/hooks/useFirstRender';
import {
  getAllRisks, getMonitoredRiskList, pinnedAndUnpinnedRisk, resetPagination, hideMessage
} from 'store/slices/riskManagementSlice';

import Loading from 'components/shared-components/Loading';
import DataTable from 'components/shared-components/DataTable';
import BasicTabs from 'components/shared-components/Tabs';
import { debounce } from 'lodash';
import { CONFLICT_ACTIONS, MY_CONFLICT_STATUS } from 'constants/MiscConstant';
import { getConflictColumns } from './data-table-config/risk-columns';

import './MonitoredRiskCard.css';

const { OPENED, RESOLVED, CANCELLED } = CONFLICT_ACTIONS;
const { PINNED, UNPINNED } = MY_CONFLICT_STATUS;
const { Title } = Typography;
const showUnpinnedButton = true;

const MonitoredRiskCard = ({ id, handleConflictDetails }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isFirstRender = useFirstRender();
  const pinnedMemberIdEncoded = encodeURIComponent(`pinnedUserIds|${id}`);

  const [selectedTab, setSelectedTab] = useState(OPENED);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(null);

  const {
    riskManagement: {
      status,
      monitoredConflicts: {
        pinnedConflictLoading,
        pinnedConflictShowMessage,
        pinnedConflictMessage,
        allConflictsLoading,
        allConflicts: { data: { content: allConflictList = [] } = {} } = {},
        loading,
        data: { totalElements = 0, content = [] },
        filter: { pageNumber, pageSize }
      }
    }
  } = useSelector((state) => ({
    riskManagement: state.riskManagement
  }));

  useEffect(() => {
    if (!isFirstRender) {
      dispatch(getMonitoredRiskList({
        pageNumber,
        pageSize,
        selectedTab,
        filterOr: pinnedMemberIdEncoded
      }));
    }
  }, [pinnedConflictShowMessage]);

  useEffect(() => {
    if (isFirstRender) {
      dispatch(getMonitoredRiskList({
        pageNumber,
        pageSize,
        selectedTab,
        filterOr: pinnedMemberIdEncoded
      }));
    }
    return () => {
      dispatch(resetPagination());
    };
  }, []);

  const handleChange = (pagination) => {
    const { current, pageSize: size } = pagination;
    dispatch(getMonitoredRiskList({
      pageNumber: current,
      pageSize: size,
      selectedTab,
      filterOr: pinnedMemberIdEncoded
    }));
  };

  const onTabChange = (key) => {
    setSelectedTab(key);
    dispatch(getMonitoredRiskList({
      pageNumber: 1,
      pageSize: 10,
      selectedTab: key,
      filterOr: pinnedMemberIdEncoded
    }));
  };

  const unpinConflictClickHandler = (record) => {
    const { pinnedUserIds, project: { id: projectId } } = record;
    const payload = {
      ...record,
      projectId,
      pinnedUserIds: pinnedUserIds?.filter((existingIds) => existingIds !== id)
    };

    dispatch(pinnedAndUnpinnedRisk({ payload, actionKey: UNPINNED }));
    dispatch(hideMessage());
  };

  const getDataTable = () => (
    <DataTable
      data={content}
      handleChange={handleChange}
      showPagination
      loading={loading}
      currentPage={pageNumber}
      pageSize={pageSize}
      totalElements={totalElements}
      columns={
        getConflictColumns(
          handleConflictDetails,
          selectedTab,
          showUnpinnedButton,
          unpinConflictClickHandler,
          pinnedConflictLoading
        )
      } />
  );

  const mainTabs = [
    {
      label: t('component.general.user.tab.openRisks'),
      key: OPENED,
      children: getDataTable()
    },
    {
      label: t('component.general.user.tab.resolvedRisks'),
      key: RESOLVED,
      children: getDataTable()
    },
    {
      label: t('component.general.user.tab.cancelledRisks'),
      key: CANCELLED,
      children: getDataTable()
    }
  ];

  useEffect(() => {
    if (pinnedConflictShowMessage) {
      notification[status]({ message: pinnedConflictMessage });
      setOpen(false);
    }
    if (!isFirstRender) {
      dispatch(getMonitoredRiskList({
        pageNumber,
        pageSize,
        selectedTab,
        filterOr: pinnedMemberIdEncoded
      }));
    }
  }, [pinnedConflictShowMessage]);

  const pinConflictClickHandler = (value) => {
    const { project: { id: projectId } } = value;
    const payload = {
      ...value,
      projectId,
      pinnedUserIds: [id]
    };
    dispatch(pinnedAndUnpinnedRisk({ payload, actionKey: PINNED }));
    dispatch(hideMessage());
  };

  const handleDebounce = debounce((value) => {
    dispatch(getAllRisks({
      selectedTab: OPENED, pageNumber, pageSize: 1000, searchTerm: value
    }));
  }, 2000);

  const handleSearch = (value) => {
    handleDebounce(value);
    setSearchTerm(value);
  };

  const handleDropdownVisibleChange = (visible) => {
    if (visible) {
      dispatch(getAllRisks({
        selectedTab, pageNumber: 1, pageSize: 50, searchTerm
      }));
    }
    setOpen(visible);
  };

  const dropdownRender = () => {
    if (!allConflictsLoading) {
      return (
        <div>
          {allConflictList?.map((item) => {
            const {
              conflictName, conflictStatus, createdBy, pinnedUserIds
            } = item;
            return (
              <div key={item.conflictId} className="search-dropdown-container font-weight-semibold">
                <div className="search-dropdown-text">
                  <span>{t('component.general.user.dropdown.list.conflictName.openedBy', { conflictName, conflictStatus })}</span>
                  <span>{t('component.general.user.dropdown.list.openedBy', { createdBy })}</span>
                </div>
                <Button
                  size="small"
                  disabled={allConflictsLoading || pinnedUserIds?.some((userId) => userId === id)}
                  icon={<PushpinOutlined />}
                  onClick={() => pinConflictClickHandler(item)}>
                  {t('component.general.user.pin.conflict')}
                </Button>
              </div>
            );
          })}
        </div>
      );
    }
    return <Loading />;
  };

  const monitoredConflictHeader = () => (
    <Row gutter={24}>
      <Col span={24}>
        <div className="d-flex justify-content-between">
          <Col span={12}>
            <div>
              <div className="d-flex">
                <Title level={2}>{t('component.general.user.monitored.conflicts.title')}</Title>
                <div className="pl-2 header-tag-container">
                  <Tag
                    className="px-2 border-0 font-weight-semibold"
                    color="#EFF8FF">
                    {`${totalElements} ${t('component.general.user.conflicts.label')}`}
                  </Tag>
                </div>
              </div>
              <div className="header-sub-heading">
                {t('component.general.user.conflicts.details')}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <AutoComplete
              style={{
                width: '100%'
              }}
              open={open}
              onDropdownVisibleChange={handleDropdownVisibleChange}
              options={allConflictList}
              dropdownRender={dropdownRender}
              onSearch={handleSearch}>
              <Input disabled={allConflictsLoading} size="medium" placeholder={t('component.general.user.searchRiskBy.name')} prefix={searchIcon()} allowClear />
            </AutoComplete>
          </Col>
        </div>
      </Col>
    </Row>
  );

  return (
    <Card
      customizedHeader={monitoredConflictHeader()}
      showBorder>
      <BasicTabs
        pillShaped
        items={mainTabs}
        onTabChange={onTabChange}
        selectedTab={selectedTab} />
    </Card>
  );
};
export default MonitoredRiskCard;
