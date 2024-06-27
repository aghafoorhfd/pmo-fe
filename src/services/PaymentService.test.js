import fetch from 'auth/FetchInterceptor';
import { PAYMENT_SERVICE } from 'constants/ApiConstant';
import PaymentService from './PaymentService';

jest.mock('auth/FetchInterceptor');
jest.mock('utils/utils');

describe('Payment Service', () => {
  afterEach(() => jest.clearAllMocks());
  it('should call get publishable key for Stripe Component ', () => {
    PaymentService.getPublishableKey();

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${PAYMENT_SERVICE}/payments/stripe/web-key`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call and delete the payment card ', () => {
    PaymentService.deleteCard();

    expect(fetch).toBeCalledWith({
      method: 'delete',
      url: `${PAYMENT_SERVICE}/cards/card_1N68zWGcFcmY8AQ1OFv0vZkx`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call get all cards ', () => {
    PaymentService.getActivatedCard();

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${PAYMENT_SERVICE}/payments/cards`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
  it('should update card and make it default ', () => {
    PaymentService.defaultCard();

    expect(fetch).toBeCalledWith({
      method: 'put',
      url: `${PAYMENT_SERVICE}/payments/cards/pm_1NIpJoClSHBsYya8VCrU7SEQ/default`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
  it('should pay with card', () => {
    PaymentService.payWithCard();

    expect(fetch).toBeCalledWith({
      method: 'post',
      url: `${PAYMENT_SERVICE}/payments/card-payment/cards/pm_1NIpJoClSHBsYya8VCrU7SEQ`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
});
