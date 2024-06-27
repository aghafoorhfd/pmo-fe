import React, { Suspense, useEffect, useState } from 'react';
import {
  Button, Col, notification, Row, Spin
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import DataTable from 'components/shared-components/DataTable';
import Loading from 'components/shared-components/Loading';
import BasicTabs from 'components/shared-components/Tabs';
import IntlMessage from 'components/util-components/IntlMessage';
import UserService from 'services/UserService';
import {
  getUsers,
  hideUserMessage,
  reactivateUser,
  revokeUser,
  toggleForm,
  resetPagination,
  getUserLicenses,
  getUserStats,
  getUserBarStats
} from 'store/slices/userSlice';
import {
  ROLES_ACCESS_TYPES,
  USER_DASHBOARD_ACTIONS,
  USER_DASHBOARD_TABS,
  initialPaginationConfiguration as defaultPagination,
  USER_STATS_TYPES,
  USER_GRAPH_STATUS
} from 'constants/MiscConstant';
import { PlusOutlined } from '@ant-design/icons';
import { Card } from 'components/shared-components/Card';
import { noop } from 'lodash';
import useFirstRender from 'utils/hooks/useFirstRender';
import { donutAndLineChartParser, donutAndLineChartParserFilteredLabels } from 'utils/utils';
import {
  getUsersColumns,
  getCurrentUserActions
} from './data-table-config/user-dashboard-columns';
import UserTrackCharWidget from './data-widgets/UserTrackChartWidget';
import LicensedUserWidget from './data-widgets/LicensedUserWidget';

const UserForm = React.lazy(() => import('components/common/user-form-modal'));

const UserDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // state for sorting.
  const [sortedInfo, setSortedInfo] = useState({
    order: '',
    columnKey: 'firstName'
  });

  const {
    user: {
      users,
      totalLicenses,
      message,
      userStats,
      userBarStats,
      userBarStatsLoading,
      userStatsLoading,
      showMessage,
      loading,
      filter: { pageNumber, pageSize },
      remainingLicenses
    },
    auth: { userProfile, user }
  } = useSelector((state) => ({
    user: state.user,
    auth: state.auth
  }));

  const { usersList: { content = [] } = {} } = users;
  const accessType = userProfile ? userProfile.accessType : user;

  // state for active tabs.
  const [selectedTab, setSelectedTab] = useState(
    USER_DASHBOARD_TABS.CURRENT_USERS
  );

  const [selectedRecord, setSelectedRecord] = useState();
  const [selectedAction, setSelectedAction] = useState();
  const [usersCount, setUsersCount] = useState({ series: [], labels: [] });
  const [usersPieChartCount, setUsersPieChartCount] = useState({});
  const totalUsers = users?.usersList?.totalElements;
  const isFirstRender = useFirstRender();
  const { ACTIVE, UNUSED_LICENSES } = USER_GRAPH_STATUS;
  const getFilterStatus = (tab) => {
    switch (tab) {
      case USER_DASHBOARD_TABS.CURRENT_USERS:
        return encodeURIComponent('[ACTIVE,REVOKED]');
      case USER_DASHBOARD_TABS.ACTIVE:
        return 'ACTIVE';
      case USER_DASHBOARD_TABS.REVOKED:
        return 'REVOKED';
      default:
        return 'ACTIVE';
    }
  };

  useEffect(() => {
    if (accessType) {
      dispatch(
        getUsers({
          accessType,
          selectedTab: getFilterStatus(selectedTab),
          pageNumber: isFirstRender ? defaultPagination.page : pageNumber,
          pageSize
        })
      );
    }
  }, [selectedTab, accessType]);

  const fetchLatestUsers = () => {
    dispatch(
      getUsers({
        accessType,
        selectedTab: getFilterStatus(selectedTab),
        pageNumber,
        pageSize
      })
    );
  };

  useEffect(() => {
    if ((message === t('component.user.dashboard.reActivate.message')
    || t('component.user.dashboard.rejected.message'))) {
      setSelectedAction({ actionType: null, actionHandler: noop });
    }
  }, [message]);

  const showModal = () => {
    dispatch(toggleForm());
  };
  const onTabChange = (key) => {
    dispatch(resetPagination());
    setSelectedTab(key);
  };

  const operations = () => (
    <Button onClick={showModal} type="primary" icon={<PlusOutlined />} id="add-user-button">
      {t('component.user.dashboard.addNewUser')}
    </Button>
  );

  const tableLoading = {
    spinning: loading,
    indicator: <Spin />
  };

  const handleSendInvite = async (record) => {
    try {
      await UserService.sendInvite(record?.id);
      notification.success({
        message: (
          <IntlMessage id="component.user.dashboard.sendInviteSuccess" />
        )
      });
    } catch (err) {
      notification.error({
        message: err?.message || (
          <IntlMessage id="component.user.dashboard.sendInviteError" />
        )
      });
    }
  };

  const handleChange = (pagination, filters, sorter) => {
    const { current, pageSize: size } = pagination;
    if (pageNumber !== current || pageSize !== size) {
      dispatch(
        getUsers({
          accessType,
          selectedTab: getFilterStatus(selectedTab),
          pageNumber: current,
          pageSize: size
        })
      );
    } else {
      setSortedInfo(sorter);
    }
  };

  const handleRevoke = (record) => {
    dispatch(revokeUser(record?.id));
  };

  const handleReactivateUser = (record) => {
    dispatch(reactivateUser(record?.id));
  };
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setSelectedAction({ actionType: null, actionHandler: noop });
    dispatch(toggleForm());
  };
  const handleAction = (record, actionType, actionHandler) => {
    setSelectedRecord(record);
    setSelectedAction({ actionType, actionHandler });
    dispatch(toggleForm());
  };
  const handleActions = (actionType, record) => {
    switch (actionType) {
      case USER_DASHBOARD_ACTIONS.SEND_INVITE:
        handleSendInvite(record);
        break;
      case USER_DASHBOARD_ACTIONS.EDIT_USER:
        handleEdit(record);
        break;
      case USER_DASHBOARD_ACTIONS.GRANT_ACCESS:
        handleAction(record, actionType, handleReactivateUser);
        break;
      case USER_DASHBOARD_ACTIONS.REVOKE_ACCESS:
        handleAction(record, actionType, handleRevoke);
        break;
      default:
    }
  };

  const getDataTable = () => (
    <DataTable
      loading={tableLoading}
      data={content}
      handleChange={handleChange}
      showPagination
      pageSize={pageSize}
      currentPage={pageNumber}
      totalElements={users?.usersList?.totalElements}
      columns={[
        ...getUsersColumns(sortedInfo, handleActions, selectedTab),
        getCurrentUserActions(handleActions, accessType)
      ]} />
  );

  const mainTabs = [
    {
      label: <IntlMessage id="component.user.dashboard.allUsers" />,
      key: USER_DASHBOARD_TABS.CURRENT_USERS,
      children: getDataTable()
    },
    {
      label: <IntlMessage id="component.user.dashboard.activeUsers" />,
      key: USER_DASHBOARD_TABS.ACTIVE,
      children: getDataTable()
    },
    {
      label: <IntlMessage id="component.user.dashboard.revokedUsers" />,
      key: USER_DASHBOARD_TABS.REVOKED,
      children: getDataTable()
    }
  ];

  const userHeadings = {
    'current-users': t('component.user.dashboard.all.users'),
    active: t('component.admin.billing.dashboard.activeUsers.input.label'),
    revoked: t('component.user.dashboard.revoked.users')
  };

  useEffect(() => {
    const successMessages = [
      t('component.user.dashboard.userAdded.success.message'),
      t('component.user.dashboard.userEdit.success.message'),
      t('component.user.dashboard.revoke.message'),
      t('component.user.dashboard.reActivate.message')
    ];
    if (showMessage) {
      if (successMessages.includes(message)) {
        fetchLatestUsers();
        dispatch(getUserBarStats(USER_STATS_TYPES.USER_STATS));
      }
      dispatch(hideUserMessage());
    }
  }, [showMessage]);

  useEffect(() => {
    dispatch(getUserLicenses());
    dispatch(getUserBarStats(USER_STATS_TYPES.USER_STATS));
  }, []);

  useEffect(() => {
    if (totalLicenses > 0 || remainingLicenses) {
      dispatch(getUserStats(remainingLicenses));
    }
  }, [totalLicenses, remainingLicenses]);

  useEffect(() => {
    if (userStats.length) {
      setUsersPieChartCount(donutAndLineChartParserFilteredLabels(userStats, USER_GRAPH_STATUS, [ACTIVE.key, UNUSED_LICENSES.key], 'registrationStatus', 'noOfUsers'));
    }
    if (userBarStats.length) {
      setUsersCount(donutAndLineChartParser(userBarStats, ROLES_ACCESS_TYPES, 'accessType', 'noOfUsers'));
    }
  }, [userStats, userBarStats]);

  return (
    <>
      <Row data-i="users-category-bar-chart" gutter={[16, 4]}>
        <Col span={12}>
          <UserTrackCharWidget
            heading={t('component.user.dashboard.widget.NoOfUsers.heading')}
            totalUsers={usersCount?.totalSum}
            usersCount={usersCount}
            loading={userBarStatsLoading} />
        </Col>
        <Col span={12}>
          <LicensedUserWidget usersPieChartCount={usersPieChartCount} loading={userStatsLoading} />
        </Col>
      </Row>
      <Suspense fallback={<Loading cover="content" />}>
        <UserForm
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          action={selectedAction}
          setAction={setSelectedAction} />
      </Suspense>
      <Card
        heading={userHeadings[selectedTab]}
        description={t('component.user.dashboard.widget.description')}
        tagText={`${totalUsers} ${t('component.user.dashboard.label.users')}`}
        actionBtn={operations()}
        showBorder>
        <BasicTabs
          pillShaped
          data-i="users-tabs"
          items={(accessType === ROLES_ACCESS_TYPES.SUPER_ADMIN.key
            || accessType === ROLES_ACCESS_TYPES.ADMIN.key) ? mainTabs : mainTabs.slice(0, 2)}
          onTabChange={onTabChange}
          selectedTab={selectedTab} />
      </Card>
    </>
  );
};

export default UserDashboard;
