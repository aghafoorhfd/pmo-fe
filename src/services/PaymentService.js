import fetch from 'auth/FetchInterceptor';
import { PAYMENT_SERVICE } from 'constants/ApiConstant';

const PaymentService = {
  getPublishableKey() {
    return fetch({
      url: `${PAYMENT_SERVICE}/payments/web-key`,
      method: 'get'
    });
  },
  createPaymentIntent(payload) {
    return fetch({
      url: `${PAYMENT_SERVICE}/payments/payment-intent`,
      method: 'post',
      data: payload
    });
  },
  savePaymentInformation(payload) {
    return fetch({
      url: `${PAYMENT_SERVICE}/payments/payment-information`,
      method: 'post',
      data: payload
    });
  },
  getActivatedCard() {
    return fetch({
      url: `${PAYMENT_SERVICE}/payments/cards`,
      method: 'get'
    });
  },
  payWithCard(cardId, payload) {
    return fetch({
      url: `${PAYMENT_SERVICE}/payments/card-payment/cards/${cardId}`,
      method: 'POST',
      data: payload
    });
  },
  deleteCard(cardId) {
    return fetch({
      url: `${PAYMENT_SERVICE}/payments/cards/${cardId}`,
      method: 'delete'
    });
  },
  defaultCard(cardId) {
    return fetch({
      url: `${PAYMENT_SERVICE}/payments/cards/${cardId}/default`,
      method: 'put'
    });
  },
  createSession(payload) {
    return fetch({
      url: `${PAYMENT_SERVICE}/payments/session`,
      method: 'post',
      data: payload
    });
  }
};

export default PaymentService;
