import { Elements } from '@stripe/react-stripe-js';
import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import PaymentService from 'services/PaymentService';
import { getValueFromLocalStorage, removeItemFromLocalStorage } from 'utils/utils';
import { SELECTED_PACKAGE_KEY } from 'constants/MiscConstant';
import PaymentConfirmationContent from './PaymentConfirmationContent';
import PaymentConfirmation from './PaymentConfirmation';

const PaymentConfirmationWrapper = () => {
  const {
    packageName, freeTrial
  } = getValueFromLocalStorage(SELECTED_PACKAGE_KEY) || {};

  const [clientSecretIntent, setClientSecretIntent] = useState(null);
  const [publishableKey, setPublishableKey] = useState(null);
  const [pkgName] = useState(packageName);
  const cardPayment = new URLSearchParams(window.location.search).get(
    'card_payment'
  );

  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret'
  );

  const getPublishableKey = async () => {
    try {
      const response = await PaymentService.getPublishableKey();
      setPublishableKey(response.data);
    } catch (error) {
      notification.error({ message: error });
    }
  };

  useEffect(() => {
    if (clientSecret) {
      setClientSecretIntent(clientSecret);
    }
    // Only fetch the Stripe Public key when payment coming from new card.
    if (!cardPayment && clientSecret) {
      getPublishableKey();
    }
  }, []);

  useEffect(() => {
    if (cardPayment) {
      removeItemFromLocalStorage(SELECTED_PACKAGE_KEY);
    }
  }, []);

  if (cardPayment) {
    return (<PaymentConfirmationContent packageName={pkgName} freeTrial={freeTrial} />);
  }

  if (!publishableKey || !clientSecretIntent) return;

  return (
    <Elements stripe={loadStripe(publishableKey)} options={{ clientSecret: clientSecretIntent }}>
      <PaymentConfirmation clientSecret={clientSecretIntent} />
    </Elements>
  );
};

export default PaymentConfirmationWrapper;
