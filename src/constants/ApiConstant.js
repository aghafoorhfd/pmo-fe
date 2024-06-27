import { env } from '../configs/EnvironmentConfig';

export const REACT_APP_BASE_URL = env.REACT_APP_URL;

export const USER_SERVICE_BASE_URL = env.USER_SERVICE;
export const USER_SERVICE = `${USER_SERVICE_BASE_URL}/user_service/api/users`;
export const USER_PROFILE = `${USER_SERVICE}/user-profile`;
export const REGISTER_USER = `${USER_SERVICE}/register`;
export const FORGOT_PASSWORD = `${USER_SERVICE}/forgot-password`;
export const VERIFY_EMAIL = `${USER_SERVICE}/verify-email`;
export const SET_CREDENTIALS = `${USER_SERVICE}/credentials`;
export const LOGIN = `${USER_SERVICE}/login`;

export const AUTH_SERVICE_BASE_URL = env.AUTH_SERVICE;
export const AUTH_SERVICE = `${AUTH_SERVICE_BASE_URL}/auth_service/api/users`;
export const RESET_CREDENTIALS = `${AUTH_SERVICE}/reset-password`;

export const GLOBAL_SERVICE_BASE_URL = env.GLOBAL_SERVICE;
export const GLOBAL_SERVICE = `${GLOBAL_SERVICE_BASE_URL}/global_service/api`;

export const PROJECT_SERVICE_BASE_URL = env.PROJECT_SERVICE;
export const PROJECT_SERVICE = `${PROJECT_SERVICE_BASE_URL}/project_service/api`;
export const ADD_PROJECT = `${PROJECT_SERVICE}/projects`;
export const INVITE_STAKEHOLDERS = `${PROJECT_SERVICE}/projects/invite-stakeholders`;
export const PROJECT_RESOURCES = `${PROJECT_SERVICE}/projects/resources-stats`;
export const PROJECT_CONFLICTS = `${PROJECT_SERVICE}/projects/conflicts-stats`;
export const COMPANY_METHODOLOGY = `${PROJECT_SERVICE}/company/methodology`;

export const PAYMENT_SERVICE_BASE_URL = env.PAYMENT_SERVICE;
export const PAYMENT_SERVICE = `${PAYMENT_SERVICE_BASE_URL}/paymentgateway_service/api`;

export const SUBSCRIPTION_SERVICE_BASE_URL = env.SUBSCRIPTION_SERVICE;
export const SUBSCRIPTION_SERVICE = `${SUBSCRIPTION_SERVICE_BASE_URL}/subscription_service/api`;

export const RESOURCE_SERVICE_BASE_URL = env.RESOURCE_SERVICE_API_ENDPOINT_URL;
export const RESOURCE_SERVICE = `${RESOURCE_SERVICE_BASE_URL}/resource_service/api`;
export const RESOURCE_TEAM = `${RESOURCE_SERVICE}/resource-teams`;
export const RESOURCE_REQUEST = `${RESOURCE_SERVICE}/project-manager/resources`;

export const PAYMENT_CONFIRMATION_URL = '/app/dashboards/payment-confirmation';
