import fetch from 'auth/FetchInterceptor';
import {
  SUBSCRIPTION_SERVICE
} from 'constants/ApiConstant';

const SubscriptionService = {
  addPlan(data) {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/plans`,
      method: 'post',
      data
    });
  },

  getAllCustomersPlans(pageNumber, pageSize, uri = '') {
    const filterAndParam = uri && `?filterAnd=${uri}`;
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/plans/customers/${pageNumber}/${pageSize}${filterAndParam}`,
      method: 'get'
    });
  },

  getAllB2BPlans(pageNumber, pageSize) {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/plans/${pageNumber}/${pageSize}`,
      method: 'get'
    });
  },

  getPlans() {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/plans/web?isAdmin=false`,
      method: 'get'
    });
  },

  getActiveSubscription() {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/subscriptions/active`,
      method: 'get'
    });
  },

  getInvoice(params) {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/plans/invoice`,
      method: 'get',
      params
    });
  },

  getSubscriptionsBilling() {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/subscriptions/billing`,
      method: 'get'
    });
  },
  getPendingInvoice() {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/invoice`,
      method: 'get'
    });
  },
  upgradeEnterprisePlan(payload) {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/plans/upgrade-enterprise-plan`,
      method: 'put',
      data: payload
    });
  }

};
export default SubscriptionService;
