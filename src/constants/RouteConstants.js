import { AUTH_PREFIX_PATH, APP_PREFIX_PATH, WEB_PREFIX_PATH } from 'configs/AppConfig';
import {
  ADMIN_DASHBOARD,
  ADMIN_BILLING_DASHBOARD,
  BILLING_CYCLE_DASHBOARD,
  // PAYMENT_OPTIONS,
  RISK_MANAGEMENT,
  FORGOT_PASSWORD,
  JIRA_TIMELINE,
  JIRA_TIMELINE_CALLBACK,
  LOGIN,
  PAGE_NOT_FOUND,
  PRODUCT_ADMIN,
  CUSTOMER_ACTIVATION,
  PAYMENT_CONFIRMATION,
  PAYMENT_INTENT,
  PROJECT_HISTORY,
  PROJECT_METRICS,
  PROJECT_CADENCE,
  PROJECT_MANAGER_DASHBOARD,
  PROJECT_MANAGER_TIMELINES,
  PROJECT_RESOURCE_DASHBOARD,
  PROJECT_REQUEST_RESOURCES,
  REGISTER,
  RESOURCE_TEAM,
  RESOURCE_MANAGER_TEAM_SETUP,
  RESOURCE_REQUEST,
  RESOURCE_COMMITMENT,
  SET_PASSWORD,
  SETTINGS_SCREEN,
  USER_DASHBOARD,
  USER_REQUESTS_DASHBOARD,
  WEBSITE,
  UPGRADE_PACKAGE,
  MY_PROJECTS,
  MY_RISKS,
  MY_WORK,
  PENDING_INVOICE,
  EXECUTIVE,
  FAQ
} from 'configs/ComponentConstants';

const ROUTES = {
  LOGIN: {
    key: 'login',
    path: `${AUTH_PREFIX_PATH}/login`,
    component: LOGIN
  },
  REGISTER: {
    key: 'register',
    path: `${AUTH_PREFIX_PATH}/register`,
    component: REGISTER
  },
  FORGOT_PASSWORD: {
    key: 'forgot-password',
    path: `${AUTH_PREFIX_PATH}/forgot-password`,
    component: FORGOT_PASSWORD
  },
  SET_PASSWORD: {
    key: 'set-password',
    path: `${AUTH_PREFIX_PATH}/set-password/:tenantId/:token`,
    component: SET_PASSWORD,
    meta: {
      newUser: true
    }
  },
  RESET_PASSWORD: {
    key: 'reset-password',
    path: `${AUTH_PREFIX_PATH}/reset-password/:tenantId/:token`,
    component: SET_PASSWORD,
    meta: {
      newUser: false
    }
  },
  PAGE_NOT_FOUND: {
    key: 'page-not-found',
    path: '/404',
    component: PAGE_NOT_FOUND
  },
  PRICING_PACKAGES: {
    key: 'pricing-packages',
    path: `${WEB_PREFIX_PATH}/main`,
    component: WEBSITE
  },
  ADMIN_DASHBOARD: {
    key: 'admin-dashboard',
    path: `${APP_PREFIX_PATH}/dashboards/admin-dashboard`,
    component: ADMIN_DASHBOARD
  },
  CADENCE: {
    key: 'dashboards-cadence',
    path: `${APP_PREFIX_PATH}/dashboards/cadence`,
    component: PROJECT_CADENCE
  },
  PROJECT_METRICS: {
    key: 'dashboard.project-metrics',
    path: `${APP_PREFIX_PATH}/dashboards/project-metrics`,
    component: PROJECT_METRICS
  },
  BUDGET: {
    key: 'dashboard.admin-budget',
    path: `${APP_PREFIX_PATH}/dashboards/budget`,
    component: () => <h1>Budget screen is in Progress</h1>
  },
  USER: {
    key: 'dashboard.user',
    path: `${APP_PREFIX_PATH}/dashboards/user`,
    component: USER_DASHBOARD
  },
  USER_REQUESTS: {
    key: 'dashboard.userRequests',
    path: `${APP_PREFIX_PATH}/dashboards/userRequests`,
    component: USER_REQUESTS_DASHBOARD
  },
  RISK_MANAGEMENT: {
    key: 'dashboard.riskManagement',
    path: `${APP_PREFIX_PATH}/dashboards/project-risks`,
    component: RISK_MANAGEMENT
  },
  PROJECT_MANAGER_DASHBOARD: {
    key: 'dashboard.projectManager',
    path: `${APP_PREFIX_PATH}/dashboards/project-manager-dashboard`,
    component: PROJECT_MANAGER_DASHBOARD
  },
  PROJECT_TIMELINES: {
    key: 'dashboard.projectManager.projectTimelines',
    path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-timelines`,
    component: PROJECT_MANAGER_TIMELINES
  },
  JIRA_CALLBACK: {
    key: 'dashboard.projectManager.jiraCallback',
    path: '/callback',
    component: JIRA_TIMELINE_CALLBACK
  },
  PROFILE_SETTINGS: {
    key: 'dashboard.profile.settings',
    path: `${APP_PREFIX_PATH}/dashboards/user-profile-settings`,
    component: SETTINGS_SCREEN
  },
  PROJECT_RESOURCES_DASHBOARD: {
    key: 'dashboard.projectManager.projectResourcesDashboard',
    path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-resources-dashboard`,
    component: PROJECT_RESOURCE_DASHBOARD
  },
  PROJECT_RESOURCES: {
    key: 'dashboard.projectManager.projectResources',
    path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-resources`,
    component: PROJECT_RESOURCE_DASHBOARD
  },
  PROJECT_BUDGET: {
    key: 'dashboard.projectManager.projectResources',
    path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-budget`,
    component: () => <h1>Work In Progress</h1>
  },
  PROJECT_OKRS: {
    key: 'dashboard.projectManager.projectOkrs',
    path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-okrs`,
    component: () => <h1>Work In Progress</h1>
  },
  PROJECT_RESOURCES_REQUEST: {
    key: 'dashboard.projectManager.projectResourcesRequest',
    path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-request-resources/:projectId`,
    component: PROJECT_REQUEST_RESOURCES
  },
  BILLING_CYCLE: {
    key: 'sidenav.dashboard.billing',
    path: `${APP_PREFIX_PATH}/dashboards/billing-cycle`,
    component: BILLING_CYCLE_DASHBOARD
  },
  JIRA_TIMELINE: {
    key: 'dashboard.projectManager.jiraTimeline',
    path: `${APP_PREFIX_PATH}/dashboards/project-manager/jira-timelines`,
    component: JIRA_TIMELINE
  },
  PROJECT_HISTORY: {
    key: 'dashboard.projectManager.projectHistory',
    path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-history`,
    component: PROJECT_HISTORY
  },
  RESOURCE_MANAGER_DASHBOARD: {
    key: 'dashboard.resourceManager',
    path: `${APP_PREFIX_PATH}/dashboards/resource-manager/resource-manager-dashboard`,
    component: RESOURCE_TEAM
  },
  TEAM_SETUP: {
    key: 'dashboard.resourceManager.teamSetup',
    path: `${APP_PREFIX_PATH}/dashboards/resource-manager/resource-manager-team-setup/:teamId`,
    component: RESOURCE_MANAGER_TEAM_SETUP
  },
  PAYMENT_INTENT: {
    key: 'dashboard.payment.intent',
    path: `${APP_PREFIX_PATH}/dashboards/payment-intent`,
    component: PAYMENT_INTENT
  },
  PAYMENT_CONFIRMATION: {
    key: 'dashboard.payment.confirmation',
    path: `${APP_PREFIX_PATH}/dashboards/payment-confirmation`,
    component: PAYMENT_CONFIRMATION
  },
  RESOURCE_REQUESTS: {
    key: 'dashboard.resourceManager.resourceRequests',
    path: `${APP_PREFIX_PATH}/dashboards/resource-manager/resource-requests`,
    component: RESOURCE_REQUEST
  },
  BILLING_DASHBOARD: {
    key: 'dashboard.admin.billing.dashboard',
    path: `${APP_PREFIX_PATH}/dashboards/admin-billing-dashboard`,
    component: ADMIN_BILLING_DASHBOARD
  },
  DASHBOARD_ANALYTICS: {
    key: 'dashboard.product.admin',
    path: `${APP_PREFIX_PATH}/dashboards/analytics`,
    component: PRODUCT_ADMIN
  },
  CUSTOMER_ACTIVATION: {
    key: 'dashboard.customer.activation',
    path: `${APP_PREFIX_PATH}/dashboards/customer-activation`,
    component: CUSTOMER_ACTIVATION
  },
  GENERAL_USER_MY_PROJECTS: {
    key: 'dashboard.general.user.myProjects',
    path: `${APP_PREFIX_PATH}/dashboards/general-user/my-projects`,
    component: MY_PROJECTS
  },
  GENERAL_USER_MY_RISKS: {
    key: 'dashboard.general.user.myRisks',
    path: `${APP_PREFIX_PATH}/dashboards/general-user/my-risks`,
    component: MY_RISKS
  },
  GENERAL_USER_MY_WORK: {
    key: 'dashboard.general.user.myWork',
    path: `${APP_PREFIX_PATH}/dashboards/general-user/my-work`,
    component: MY_WORK
  },
  // PAYMENT_OPTIONS_DASHBOARD: {
  //   key: 'dashboard.payment.options',
  //   path: `${APP_PREFIX_PATH}/dashboards/payment-options`,
  //   component: PAYMENT_OPTIONS
  // },
  RESOURCE_COMMITMENT: {
    key: 'dashboard.resourceManager.resourceCommitment',
    path: `${APP_PREFIX_PATH}/dashboards/resource-manager/resource-commitment`,
    component: RESOURCE_COMMITMENT
  },
  RESOURCE_MANAGER_MY_RISKS: {
    key: 'dashboard.resourceManager.myRisks',
    path: `${APP_PREFIX_PATH}/dashboards/resource-manager/risks`,
    component: MY_RISKS
  },
  UPGRADE_PACKAGE: {
    key: 'dashboard.upgrade.package',
    path: `${APP_PREFIX_PATH}/dashboards/upgrade-package`,
    component: UPGRADE_PACKAGE
  },
  RESOURCE_TEAM: {
    key: 'dashboard.resourceTeam',
    path: `${APP_PREFIX_PATH}/dashboards/resource-team`,
    component: RESOURCE_TEAM
  },
  PRODUCT_ADMIN_DASHBOARD: {
    key: 'dashboard.product.admin',
    path: `${APP_PREFIX_PATH}/dashboards/product_admin`,
    component: PRODUCT_ADMIN
  },
  PENDING_INVOICE: {
    key: 'dashboard.pending.invoice',
    path: `${APP_PREFIX_PATH}/dashboards/pending-invoice`,
    component: PENDING_INVOICE
  },
  EXECUTIVE_DASHBOARD: {
    key: 'dashboard.executive.dashboard.executive',
    path: `${APP_PREFIX_PATH}/dashboards/executive/dashboard`,
    component: EXECUTIVE
  },
  FAQ: {
    key: 'dashboard.faq',
    path: `${APP_PREFIX_PATH}/dashboards/faq`,
    component: FAQ
  }
};

export default ROUTES;
