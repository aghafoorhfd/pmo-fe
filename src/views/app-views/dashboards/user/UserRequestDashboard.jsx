import React, { useEffect, useState } from 'react';
import {
  Col, Row, Spin, notification
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import DataTable from 'components/shared-components/DataTable';
import BasicTabs from 'components/shared-components/Tabs';
import IntlMessage from 'components/util-components/IntlMessage';

import {
  getUsers, hideUserMessage, rejectUser, resetPagination, sendInvite
} from 'store/slices/userSlice';
import {
  ROLES_ACCESS_TYPES, USER_DASHBOARD_ACTIONS, USER_DASHBOARD_TABS,
  initialPaginationConfiguration as defaultPagination,
  USER_STATS_TYPES,
  USER_GRAPH_STATUS
} from 'constants/MiscConstant';
import { Card } from 'components/shared-components/Card';
import useFirstRender from 'utils/hooks/useFirstRender';
import UserService from 'services/UserService';
import { donutAndLineChartParser, handleUserPieChartStatistics } from 'utils/utils';
import { getUsersColumns, getPendingUserActions } from './data-table-config/user-dashboard-columns';
import UserRequestsWidget from './data-widgets/UserRequestsWidget';
import UserTrackCharWidget from './data-widgets/UserTrackChartWidget';

const UserRequestDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [usersCount, setUsersCount] = useState({ series: [], labels: [], totalSum: 0 });
  const [usersPieChartCount, setUsersPieChartCount] = useState({
    series: [0, 0],
    labels: [t(USER_GRAPH_STATUS.PENDING.value),
      t(USER_GRAPH_STATUS.REJECTED.value)],
    totalCount: 0
  });
  const [statLoading, setStatLoading] = useState(true);

  // state for sorting.
  const [sortedInfo, setSortedInfo] = useState({
    order: '',
    columnKey: 'firstName'
  });

  const {
    user: {
      users, message, showMessage, loading,
      filter: { pageNumber, pageSize }
    },
    auth: { userProfile, user }
  } = useSelector((state) => ({
    user: state.user,
    auth: state.auth
  }));
  const isFirstRender = useFirstRender();
  const { usersList: { content = [] } = {} } = users;
  const accessType = userProfile ? userProfile.accessType : user;

  // state for active tabs.
  const [selectedTab, setSelectedTab] = useState(USER_DASHBOARD_TABS.USER_REQUESTS);

  const totalUsers = users?.usersList?.totalElements;

  const getFilterStatus = (tab) => {
    switch (tab) {
      case USER_DASHBOARD_TABS.USER_REQUESTS:
        return encodeURIComponent('[PENDING,REJECTED]');
      case USER_DASHBOARD_TABS.PENDING:
        return 'PENDING';
      case USER_DASHBOARD_TABS.REJECTED:
        return 'REJECTED';
      default:
        return 'PENDING';
    }
  };

  useEffect(() => {
    if (accessType) {
      dispatch(getUsers({
        accessType,
        selectedTab: getFilterStatus(selectedTab),
        pageNumber: isFirstRender ? defaultPagination.page : pageNumber,
        pageSize
      }));
    }
  }, [selectedTab, accessType]);

  const fetchLatestUsers = () => {
    dispatch(getUsers({
      accessType, selectedTab: getFilterStatus(selectedTab), pageNumber, pageSize
    }));
  };

  const onTabChange = (key) => {
    dispatch(resetPagination());
    setSelectedTab(key);
  };

  const requestHeadings = {
    'user-requests': t('component.user.dashboard.all.requests'),
    pending: t('sidenav.dashboard.userPendingRequests'),
    rejected: t('component.user.dashboard.rejected.requests')
  };

  const tableLoading = {
    spinning: loading,
    indicator: <Spin />
  };

  const handleChange = (pagination, filters, sorter) => {
    const { current, pageSize: size } = pagination;

    if (pageNumber !== current || pageSize !== size) {
      dispatch(getUsers({
        accessType, selectedTab: getFilterStatus(selectedTab), pageNumber: current, pageSize: size
      }));
    } else {
      setSortedInfo(sorter);
    }
  };

  const handleActions = (actionType, record) => {
    switch (actionType) {
      case USER_DASHBOARD_ACTIONS.REQUEST_APPROVE:
        dispatch(sendInvite(record?.id));
        break;
      case USER_DASHBOARD_ACTIONS.REQUEST_REJECT:
        dispatch(rejectUser(record?.id));
        break;
      default:
    }
  };

  const getDataTable = (showActionColumn = true) => {
    const columns = getUsersColumns(sortedInfo).slice(0, -1);
    const actions = getPendingUserActions(handleActions);
    return (
      <DataTable
        id="id"
        loading={tableLoading}
        data={content}
        handleChange={handleChange}
        showPagination
        pageSize={pageSize}
        currentPage={pageNumber}
        totalElements={users?.usersList?.totalElements}
        columns={showActionColumn ? [...columns, actions] : [...columns]} />
    );
  };

  const mainTabs = [
    {
      label: <IntlMessage id="component.user.dashboard.allUsers" />,
      key: USER_DASHBOARD_TABS.USER_REQUESTS,
      children: getDataTable()
    },
    {
      label: <IntlMessage id="component.user.dashboard.pending" />,
      key: USER_DASHBOARD_TABS.PENDING,
      children: getDataTable()
    },
    {
      label: <IntlMessage id="component.user.dashboard.rejected" />,
      key: USER_DASHBOARD_TABS.REJECTED,
      children: getDataTable(false)
    }
  ];

  const getUsersStatistics = async () => {
    try {
      const [usersStatistics, usersPieChartStatistics] = await Promise.all([
        UserService.getUsersStatistics(USER_STATS_TYPES.PENDING_REQUEST_STATS),
        UserService.getUsersStatistics(USER_STATS_TYPES.USER_PIE_CHART_STATS)
      ]);

      setUsersCount(donutAndLineChartParser(usersStatistics.data, ROLES_ACCESS_TYPES, 'accessType', 'noOfUsers'));
      setUsersPieChartCount(handleUserPieChartStatistics(
        usersPieChartStatistics.data,
        usersPieChartCount
      ));
    } catch (err) {
      notification.error({
        message: err?.message || t('component.user.dashboard.userStatisticsError')
      });
    } finally {
      setStatLoading(false);
    }
  };
  useEffect(() => {
    const successMessages = [
      t('component.user.dashboard.rejected.message'),
      t('component.user.dashboard.sendInviteSuccess')
    ];
    if (showMessage) {
      if (successMessages.includes(message)) {
        fetchLatestUsers();
        getUsersStatistics();
      }
      dispatch(hideUserMessage());
    }
  }, [showMessage]);

  useEffect(() => {
    getUsersStatistics();
  }, []);

  return (
    <>
      <Row data-i="pending-users-widgets" gutter={[16, 4]}>
        <Col span={12}>
          <UserTrackCharWidget
            heading={t('component.user.dashboard.widget.NoOfPendingUsers.heading')}
            totalUsers={usersCount?.totalSum}
            usersCount={usersCount}
            loading={statLoading} />
        </Col>
        <Col span={12}>
          <UserRequestsWidget
            totalUsers={totalUsers}
            usersPieChartCount={usersPieChartCount}
            loading={statLoading} />
        </Col>
      </Row>
      <Card
        heading={requestHeadings[selectedTab]}
        description={t('component.user.dashboard.widget.description')}
        tagText={`${totalUsers} ${t('component.user.dashboard.requests')}`}
        showBorder>
        <BasicTabs
          pillShaped
          data-i="pending-requests-tabs"
          items={(accessType === ROLES_ACCESS_TYPES.SUPER_ADMIN.key
            || accessType === ROLES_ACCESS_TYPES.ADMIN.key) ? mainTabs : mainTabs.slice(0, 2)}
          onTabChange={onTabChange}
          selectedTab={selectedTab} />
      </Card>
    </>
  );
};

export default UserRequestDashboard;
