import ROUTES from './RouteConstants';

const {
  CADENCE,
  PROJECT_METRICS,
  BUDGET,
  RESOURCE_TEAM,
  TEAM_SETUP,
  USER,
  USER_REQUESTS,
  BILLING_CYCLE,
  PROJECT_MANAGER_DASHBOARD,
  PROJECT_TIMELINES,
  JIRA_TIMELINE,
  JIRA_CALLBACK,
  RISK_MANAGEMENT,
  PROJECT_RESOURCES_DASHBOARD,
  RESOURCE_MANAGER_MY_RISKS,
  PROJECT_RESOURCES_REQUEST,
  PROJECT_BUDGET,
  PROJECT_OKRS,
  PROJECT_HISTORY,
  RESOURCE_MANAGER_DASHBOARD,
  RESOURCE_COMMITMENT,
  BILLING_DASHBOARD,
  GENERAL_USER_MY_PROJECTS,
  GENERAL_USER_MY_RISKS,
  GENERAL_USER_MY_WORK,
  EXECUTIVE_DASHBOARD,
  RESOURCE_REQUESTS,
  // PAYMENT_OPTIONS_DASHBOARD,
  UPGRADE_PACKAGE,
  PAYMENT_INTENT,
  PAYMENT_CONFIRMATION,
  PRODUCT_ADMIN_DASHBOARD,
  CUSTOMER_ACTIVATION,
  PENDING_INVOICE,
  ADMIN_DASHBOARD,
  FAQ
} = ROUTES;

export const PRIVILIGES_CONSTANTS = {
  ADMIN_DASHBOARD: {
    ...ADMIN_DASHBOARD,
    subRoutes: [],
    key: 'admin/dashboard',
    order: 1
  },
  CADENCE: {
    ...CADENCE,
    subRoutes: [],
    key: 'admin/cadence',
    order: 2
  },
  PROJECT_METRICS: {
    ...PROJECT_METRICS,
    subRoutes: [],
    key: 'admin/projectMetrics',
    order: 3
  },
  BUDGET: {
    ...BUDGET,
    subRoutes: [],
    key: 'admin/budget',
    order: 4
  },
  RESOURCE_TEAM: {
    ...RESOURCE_TEAM,
    subRoutes: [TEAM_SETUP],
    key: 'admin/resourceTeam',
    order: 5
  },
  USER: {
    ...USER,
    subRoutes: [],
    key: 'admin/user/currentUsers',
    order: 6
  },
  USER_REQUESTS: {
    ...USER_REQUESTS,
    subRoutes: [],
    key: 'admin/user/pendingRequests',
    order: 7
  },
  BILLING_CYCLE: {
    ...BILLING_CYCLE,
    subRoutes: [UPGRADE_PACKAGE, PAYMENT_INTENT, PAYMENT_CONFIRMATION],
    key: 'admin/billing',
    order: 8
  },
  // PAYMENT_OPTIONS_DASHBOARD: {
  //   ...PAYMENT_OPTIONS_DASHBOARD,
  //   subRoutes: [],
  //   key: 'admin/paymentOptions',
  //   order: 9
  // },
  PENDING_INVOICE: {
    ...PENDING_INVOICE,
    subRoutes: [],
    key: 'admin/pendingInvoice',
    order: 10
  },
  PROJECT_MANAGER_DASHBOARD: {
    ...PROJECT_MANAGER_DASHBOARD,
    subRoutes: [PROJECT_TIMELINES],
    key: 'projectManager/dashboard',
    order: 11
  },
  JIRA_TIMELINE: {
    ...JIRA_TIMELINE,
    subRoutes: [JIRA_CALLBACK],
    key: 'projectManager/jiraTimeline',
    order: 12
  },
  RISK_MANAGEMENT: {
    ...RISK_MANAGEMENT,
    subRoutes: [],
    key: 'projectManager/projectRisks',
    order: 13
  },
  PROJECT_RESOURCES_DASHBOARD: {
    ...PROJECT_RESOURCES_DASHBOARD,
    subRoutes: [PROJECT_RESOURCES_REQUEST],
    key: 'projectManager/projectResources',
    order: 14
  },
  PROJECT_BUDGET: {
    ...PROJECT_BUDGET,
    subRoutes: [],
    key: 'projectManager/projectBudget',
    order: 15
  },
  PROJECT_OKRS: {
    ...PROJECT_OKRS,
    subRoutes: [],
    key: 'projectManager/OKRS',
    order: 16
  },
  PROJECT_HISTORY: {
    ...PROJECT_HISTORY,
    subRoutes: [],
    key: 'projectManager/projectHistory',
    order: 17
  },
  RESOURCE_MANAGER_DASHBOARD: {
    ...RESOURCE_MANAGER_DASHBOARD,
    subRoutes: [TEAM_SETUP],
    key: 'resourceManager/dashboard',
    order: 18
  },
  RESOURCE_COMMITMENT: {
    ...RESOURCE_COMMITMENT,
    subRoutes: [],
    key: 'resourceManager/fullCommitment',
    order: 19
  },
  RESOURCE_MANAGER_MY_RISKS: {
    ...RESOURCE_MANAGER_MY_RISKS,
    subRoutes: [],
    key: 'resourceManager/myRisks',
    order: 20
  },
  GENERAL_USER_MY_PROJECTS: {
    ...GENERAL_USER_MY_PROJECTS,
    subRoutes: [JIRA_CALLBACK],
    key: 'userDashboard/myProjects',
    order: 21
  },
  GENERAL_USER_MY_RISKS: {
    ...GENERAL_USER_MY_RISKS,
    subRoutes: [],
    key: 'userDashboard/myRisks',
    order: 22
  },
  GENERAL_USER_MY_WORK: {
    ...GENERAL_USER_MY_WORK,
    subRoutes: [],
    key: 'userDashboard/myWork',
    order: 23
  },
  BILLING_DASHBOARD: {
    ...BILLING_DASHBOARD,
    subRoutes: [],
    key: 'billingDashboard/',
    order: 24
  },
  RESOURCE_REQUESTS: {
    ...RESOURCE_REQUESTS,
    subRoutes: [],
    key: 'resourceManager/resourceRequests',
    order: 25
  },
  PRODUCT_ADMIN_DASHBOARD: {
    ...PRODUCT_ADMIN_DASHBOARD,
    subRoutes: [],
    key: 'analytics/',
    order: 26
  },
  CUSTOMER_ACTIVATION: {
    ...CUSTOMER_ACTIVATION,
    subRoutes: [],
    key: 'customerActivation/',
    order: 27
  },
  EXECUTIVE_DASHBOARD: {
    ...EXECUTIVE_DASHBOARD,
    subRoutes: [],
    key: 'executive/dashboard',
    order: 28
  },
  FAQ: {
    ...FAQ,
    subRoutes: [],
    key: 'faq/',
    order: 29
  }
};
