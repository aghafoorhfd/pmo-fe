import React from 'react';

// Public Routes Screens
export const LOGIN = React.lazy(() => import('views/auth-views/authentication/login'));
export const REGISTER = React.lazy(() => import('views/auth-views/authentication/register'));
export const FORGOT_PASSWORD = React.lazy(() => import('views/auth-views/authentication/forgot-password'));
export const SET_PASSWORD = React.lazy(() => import('views/auth-views/authentication/set-password'));
export const PAGE_NOT_FOUND = React.lazy(() => import('views/app-views/dashboards/page-not-found'));

// Protected Routes Screens
export const ADMIN_DASHBOARD = React.lazy(() => import('views/app-views/dashboards/admin-dashboard/index'));
export const PROJECT_CADENCE = React.lazy(() => import('views/app-views/dashboards/cadence'));
export const PROJECT_METRICS = React.lazy(() => import('views/app-views/dashboards/project-metrics/ProjectMetrics'));
export const USER_DASHBOARD = React.lazy(() => import('views/app-views/dashboards/user/UserDashboard'));
export const USER_REQUESTS_DASHBOARD = React.lazy(() => import('views/app-views/dashboards/user/UserRequestDashboard'));
export const RISK_MANAGEMENT = React.lazy(() => import('views/app-views/dashboards/conflict-management/RiskManagementDashboard'));
export const RESOURCE_TEAM = React.lazy(() => import('views/app-views/dashboards/resource-team/ResourceTeam'));
export const PROJECT_MANAGER_DASHBOARD = React.lazy(() => import('views/app-views/dashboards/project-manager/ProjectManagerDashboard'));
export const PROJECT_MANAGER_TIMELINES = React.lazy(() => import('views/app-views/dashboards/project-manager/project-timelines'));
export const SETTINGS_SCREEN = React.lazy(() => import('views/app-views/dashboards/user-profile-settings/SettingsScreen'));
export const PROJECT_RESOURCE_DASHBOARD = React.lazy(() => import('views/app-views/dashboards/project-resources/ProjectResourcesDashboard'));
export const PROJECT_REQUEST_RESOURCES = React.lazy(() => import('views/app-views/dashboards/project-resources/RequestResources'));
export const BILLING_CYCLE_DASHBOARD = React.lazy(() => import('views/app-views/dashboards/billing-cycle/BillingCycleDashboard'));
export const JIRA_TIMELINE = React.lazy(() => import('views/app-views/dashboards/project-manager/jira-timeline'));
export const JIRA_TIMELINE_CALLBACK = React.lazy(() => import('views/app-views/dashboards/project-manager/jira-timeline/JiraCallback'));
export const PROJECT_HISTORY = React.lazy(() => import('views/app-views/dashboards/project-manager/project-history'));
export const RESOURCE_MANAGER_DASHBOARD = React.lazy(() => import('views/app-views/dashboards/resource-manager/resource-manager-dashboard'));
export const RESOURCE_MANAGER_TEAM_SETUP = React.lazy(() => import('views/app-views/dashboards/resource-manager/resource-manager-team-setup'));
export const PAYMENT_INTENT = React.lazy(() => import('views/app-views/dashboards/payment-intent/PaymentIntent'));
export const PAYMENT_CONFIRMATION = React.lazy(() => import('views/app-views/dashboards/payment-confirmation/PaymentConfirmationWrapper'));
export const RESOURCE_REQUEST = React.lazy(() => import('views/app-views/dashboards/resource-manager/resource-requests/ResourceRequests'));
export const ADMIN_BILLING_DASHBOARD = React.lazy(() => import('views/app-views/dashboards/admin-billing-dashboard/AdminBillingDashbaord'));
export const PRODUCT_ADMIN = React.lazy(() => import('views/app-views/dashboards/analytics/AnalyticsScreen'));
export const CUSTOMER_ACTIVATION = React.lazy(() => import('views/app-views/dashboards/customer-activation/CustomerActivationScreen'));
export const MY_PROJECTS = React.lazy(() => import('views/app-views/dashboards/general-user/my-projects/MyProjects'));
export const MY_RISKS = React.lazy(() => import('views/app-views/dashboards/general-user/my-risk/MyRisks'));
export const MY_WORK = React.lazy(() => import('views/app-views/dashboards/general-user/my-work/MyWork'));
export const FAQ = React.lazy(() => import('views/app-views/dashboards/faq/FAQ'));
// export const PAYMENT_OPTIONS = React.lazy(() =>
// import('views/app-views/dashboards/payment-options/PaymentOptions'));
export const RESOURCE_COMMITMENT = React.lazy(() => import('views/app-views/dashboards/resource-manager/resource-commitment'));
export const UPGRADE_PACKAGE = React.lazy(() => import('views/app-views/dashboards/upgrade-package/UpgradePackage'));
export const PENDING_INVOICE = React.lazy(() => import('views/app-views/dashboards/pending-invoice'));
export const EXECUTIVE = React.lazy(() => import('views/app-views/dashboards/executive/dashboard'));

// Web Routes Screens
export const WEBSITE = React.lazy(() => import('views/web-views/website'));
