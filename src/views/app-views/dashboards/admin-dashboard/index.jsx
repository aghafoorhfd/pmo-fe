import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { notification } from 'antd';

import { MY_CONFLICT_STATUS, USER_GRAPH_STATUS } from 'constants/MiscConstant';
import { getUserLicenses, getUserStats, hideUserMessage } from 'store/slices/userSlice';

import { hideMessage as hideResourceMessage, filters } from 'store/slices/resourceTeamSlice';
import { getMonitoredStats, hideMessage as hideConflictMessage } from 'store/slices/riskManagementSlice';
import { getActiveSubscription, hideMessage as hideSubscriptionMessage } from 'store/slices/subscriptionSlice';

import { donutAndLineChartParser, nextBillingCount } from 'utils/utils';

import StatisticsCard from './statistics-cards/StatisticsCard';
import UserStatsWithBillingCart from './users-stats-and-billing-cart';
import TableViews from './resource-and-conflicts-tables';

const { IMPACTED } = MY_CONFLICT_STATUS;

function Dashboard() {
  const dispatch = useDispatch();

  const {
    user: {
      companyData,
      totalLicenses,
      remainingLicenses,
      userStats = [], userStatsLoading,
      // showMessage: userShowMessage,
      message: userMessage,
      status: userStatus
    },
    resourceTeam: {
      showMessage: resourceShowMessage,
      message: resourceMessage,
      status: resourceStatus,
      loading,
      data: { resourceTeamData: { content = [], totalElements = 0 } = {} },
      filter: { pageNumber = 1 }
    },
    riskManagement: {
      loading: conflictStatsLoading,
      // showMessage: conflictShowMessage,
      message: conflictMessage,
      status: conflictStatus,
      monitoredConflicts: {
        monitoredStats
      }
    },
    subscription: {
      loading: subcriptionLoading,
      // showMessage: showSubscriptionMessage,
      message: subscriptionMessage,
      status: subscriptionStatus,
      activeSubscription,
      activeSubscription: { nextBillingDate }
    }
  } = useSelector((state) => ({
    user: state.user,
    resourceTeam: state.resourceTeam,
    riskManagement: state.riskManagement,
    subscription: state.subscription
  }));

  const conflictCount = () => {
    const totalCount = monitoredStats?.reduce((accumulator, { count }) => accumulator + +count, 0);
    return totalCount;
  };

  const initialDashboardActions = () => {
    dispatch(getUserLicenses());
    dispatch(getActiveSubscription());
    dispatch(filters({ pageNumber, pageSize: 3 }));
    dispatch(getMonitoredStats({ conflictStatus: IMPACTED, allConflicts: true }));
  };

  useEffect(() => {
    initialDashboardActions();
  }, []);

  useEffect(() => {
    if (resourceShowMessage) {
      initialDashboardActions();
      dispatch(hideResourceMessage());
    }
  }, [resourceShowMessage]);

  const showNotification = (statusCode, message, hideTost) => {
    notification[statusCode]({ message });
    dispatch(hideTost());
  };

  const messageToShow = [
    { message: resourceMessage, status: resourceStatus, hideToast: hideResourceMessage },
    { message: userMessage, status: userStatus, hideToast: hideUserMessage },
    { message: conflictMessage, status: conflictStatus, hideToast: hideConflictMessage },
    { message: subscriptionMessage, status: subscriptionStatus, hideToast: hideSubscriptionMessage }
  ]?.filter(({ message }) => message);

  useEffect(() => {
    messageToShow?.forEach(({ status, message, hideToast }) => {
      showNotification(status, message, hideToast);
    });
  }, [messageToShow]);

  useEffect(() => {
    if (totalLicenses > 0) {
      dispatch(getUserStats(remainingLicenses));
    }
  }, [totalLicenses]);

  const userStatistics = donutAndLineChartParser(userStats, USER_GRAPH_STATUS, 'registrationStatus', 'noOfUsers');

  return (
    <>
      <StatisticsCard
        totalLicenses={totalLicenses}
        billingStatus={nextBillingCount(nextBillingDate)}
        resourceTeamCount={totalElements}
        conflictsCount={conflictCount()} />
      <UserStatsWithBillingCart
        userStatsLoading={userStatsLoading}
        userStats={userStatistics}
        subcriptionLoading={subcriptionLoading}
        activeSubscription={activeSubscription}
        companyData={companyData} />
      <TableViews
        resourceTeamLoading={loading}
        resourceTeamList={content}
        conflictStatsLoading={conflictStatsLoading}
        monitoredStats={monitoredStats}
        totalElements={totalElements}
        pageNumber={pageNumber} />
    </>
  );
}

export default Dashboard;
