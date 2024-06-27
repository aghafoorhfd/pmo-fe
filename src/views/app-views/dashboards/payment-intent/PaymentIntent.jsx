import React, { useState, useEffect } from 'react';
import {
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { notification, Spin } from 'antd';
import PaymentService from 'services/PaymentService';
import { getValueFromLocalStorage } from 'utils/utils';
import { SELECTED_PACKAGE_KEY } from 'constants/MiscConstant';
import { useNavigate } from 'react-router-dom';
import { BILLING_HISTORY } from 'configs/AppConfig';
import PaymentIntentDashboard from './PaymentIntentDashboard';

const PaymentIntentWrapper = () => {
  const navigate = useNavigate();
  const selectedPackage = getValueFromLocalStorage(SELECTED_PACKAGE_KEY);
  const { totalAmountToBeCharged, clientSecret } = selectedPackage || {};
  const [stripeKey, setStripeKey] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStripeKeyAndInvoice = async () => {
    try {
      const publishableKey = await PaymentService.getPublishableKey();
      setStripeKey(publishableKey?.data);
    } catch (error) {
      notification.error({ message: error?.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedPackage) {
      navigate(BILLING_HISTORY);
      return;
    }
    getStripeKeyAndInvoice();
  }, []);

  if ((!stripeKey || !clientSecret) && loading) {
    return (
      <Spin className="d-flex justify-content-center align-items-center" />
    );
  }

  return (
    <Elements stripe={loadStripe(stripeKey)} options={{ clientSecret }}>
      <PaymentIntentDashboard
        selectedPackage={selectedPackage}
        totalAmountToBeCharged={totalAmountToBeCharged} />
    </Elements>
  );
};
export default PaymentIntentWrapper;
