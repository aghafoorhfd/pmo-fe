import fetch from 'auth/FetchInterceptor';
import { SUBSCRIPTION_SERVICE } from 'constants/ApiConstant';
import SubscriptionService from './SubscriptionService';

jest.mock('auth/FetchInterceptor');
jest.mock('utils/utils');

describe('Subscription Service', () => {
  afterEach(() => jest.clearAllMocks());
  it('should call get Web Plans ', () => {
    SubscriptionService.getPlans();

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${SUBSCRIPTION_SERVICE}/plans/web`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call get All Customer Plans ', () => {
    SubscriptionService.getAllCustomersPlans(1, 1);

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${SUBSCRIPTION_SERVICE}/plans/customers/1/1`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call get invoiceId and amount to be charged with.', () => {
    SubscriptionService.getInvoice({
      planPackageId: 'a474055c-8187-4df2-9be3-421acd02e96a',
      licensesToPurchase: 101
    });

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${SUBSCRIPTION_SERVICE}/plans/web`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call get active subscription plan', () => {
    SubscriptionService.getActiveSubscription();

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${SUBSCRIPTION_SERVICE}/subscriptions/active`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call get subscriptions billing', () => {
    SubscriptionService.getSubscriptionsBilling();

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${SUBSCRIPTION_SERVICE}/subscriptions/billing`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call upgrade enterprise plan', () => {
    SubscriptionService.upgradeEnterprisePlan();

    expect(fetch).toBeCalledWith({
      method: 'put',
      url: `${SUBSCRIPTION_SERVICE}/plans/upgrade-enterprise-plan`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
});
