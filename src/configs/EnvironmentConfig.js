const API_ENDPOINTS = {
  AUTH_SERVICE: process.env.REACT_APP_AUTH_SERVICE_API_ENDPOINT_URL,
  USER_SERVICE: process.env.REACT_APP_USER_SERVICE_API_ENDPOINT_URL,
  GLOBAL_SERVICE: process.env.REACT_APP_GLOBAL_SERVICE_API_ENDPOINT_URL,
  PROJECT_SERVICE: process.env.REACT_APP_PROJECT_SERVICE_API_ENDPOINT_URL,
  PAYMENT_SERVICE: process.env.REACT_APP_PAYMENT_SERVICE_API_ENDPOINT_URL,
  SUBSCRIPTION_SERVICE: process.env.REACT_APP_SUBSCRIPTION_SERVICE_API_ENDPOINT_URL,
  RESOURCE_SERVICE_API_ENDPOINT_URL: process.env.REACT_APP_RESOURCE_SERVICE_API_ENDPOINT_URL,
  REACT_APP_URL: process.env.REACT_APP_URL
};

const dev = {
  ...API_ENDPOINTS
};

const prod = {
  ...API_ENDPOINTS
};

const uat = {
  ...API_ENDPOINTS
};

const test = {
  ...API_ENDPOINTS
};

const getEnv = () => {
  switch (process.env.REACT_APP_NODE_ENV) {
    case 'development':
      return dev;
    case 'production':
      return prod;
    case 'uat':
      return uat;
    case 'test':
      return test;
    default:
      break;
  }
};

export const env = getEnv();
