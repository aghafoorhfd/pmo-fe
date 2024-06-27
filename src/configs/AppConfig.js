import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE, DIR_LTR } from '../constants/ThemeConstant';

export const APP_NAME = 'PMO Tracker';
export const APP_PREFIX_PATH = '/app';
export const AUTH_PREFIX_PATH = '/auth';
export const WEB_PREFIX_PATH = '/web';
export const REDIRECT_URL_KEY = 'redirect';
export const AUTHENTICATED_ENTRY = `${APP_PREFIX_PATH}/dashboards/default`;
export const UNAUTHENTICATED_ENTRY = '/login';
export const PROJECT_CADENCE = `${APP_PREFIX_PATH}/dashboards/cadence`;
export const PROJECT_METRICS_DASHBOARD = `${APP_PREFIX_PATH}/dashboards/project-metrics`;
export const PROJECT_TIMELINE = `${APP_PREFIX_PATH}/dashboards/project-manager/project-timelines`;
export const USER_PROFILE_SETTINGS = `${APP_PREFIX_PATH}/dashboards/user-profile-settings`;
export const PAYMENT_INTENT = `${APP_PREFIX_PATH}/dashboards/payment-intent`;
export const REDIRECT_PAYMENT_OPTIONS = `${AUTH_PREFIX_PATH}/login?redirect=/app/dashboards/payment-options`;
export const PAYMENT_OPTIONS = `${APP_PREFIX_PATH}/dashboards/payment-options`;
export const BILLING_HISTORY = `${APP_PREFIX_PATH}/dashboards/billing-cycle`;
export const UPGRADE_PACKAGE = `${APP_PREFIX_PATH}/dashboards/upgrade-package`;

export const THEME_CONFIG = {
  navCollapsed: false,
  sideNavTheme: SIDE_NAV_LIGHT,
  locale: 'en',
  navType: NAV_TYPE_SIDE,
  topNavColor: '#3e82f7',
  headerNavColor: '',
  mobileNav: false,
  currentTheme: 'light',
  direction: DIR_LTR,
  blankLayout: false
};
