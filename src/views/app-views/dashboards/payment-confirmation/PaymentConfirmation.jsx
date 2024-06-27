import { useStripe } from '@stripe/react-stripe-js';
import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
import PaymentService from 'services/PaymentService';
import { useNavigate } from 'react-router-dom';
import { BILLING_HISTORY } from 'configs/AppConfig';
import { useTranslation } from 'react-i18next';
import { getValueFromLocalStorage, removeItemFromLocalStorage } from 'utils/utils';
import { SELECTED_PACKAGE_KEY, STRIPE_WEBHOOK_EVENTS } from 'constants/MiscConstant';
import Loading from 'components/shared-components/Loading';
import PropTypes from 'prop-types';
import PaymentConfirmationContent from './PaymentConfirmationContent';

const usePaymentConfirmation = (clientSecret) => {
  const {
    packageName, customerId, invoiceId
  } = getValueFromLocalStorage(SELECTED_PACKAGE_KEY) || {};

  const [loading, setLoading] = useState(true);
  const [pkgName] = useState(packageName);
  const stripe = useStripe();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { succeeded, processing, requiresPaymentMethod } = STRIPE_WEBHOOK_EVENTS;

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }
    if ((!clientSecret)) {
      navigate(BILLING_HISTORY);
      return;
    }
    const retrieveAndSavePaymentInformation = async () => {
      try {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        const {
          amount, currency, payment_method: paymentMethodId, id: paymentIntentId
        } = paymentIntent;

        switch (paymentIntent.status) {
          case succeeded: {
            if (invoiceId) {
              await PaymentService.savePaymentInformation({
                amount, currency, paymentMethodId, customerId, paymentIntentId, invoiceId
              });
              const cardResponse = await PaymentService.getActivatedCard().catch(() => {});
              // Set the Default Card if CardList contains only 1.
              if (cardResponse?.data?.length === 1) {
                await PaymentService.defaultCard(cardResponse.data[0].cardId);
              }
              notification.success({ message: t('component.payment.confirmation.success') });
            }
            break;
          }
          case processing:
            notification.info({ message: t('component.payment.confirmation.process') });
            break;
          case requiresPaymentMethod:
            notification.error({ message: t('component.payment.confirmation.unsuccessful') });
            break;
          default:
            notification.error({ message: t('component.payment.confirmation.wrong') });
            break;
        }
        removeItemFromLocalStorage(SELECTED_PACKAGE_KEY);
      } catch (error) {
        notification.error({ message: error?.message });
      } finally {
        setLoading(false);
      }
    };
    retrieveAndSavePaymentInformation();
  }, [stripe, clientSecret]);

  return { pkgName, loading };
};

const PaymentConfirmation = (props) => {
  const { clientSecret = '' } = props;
  const { pkgName: packageName, loading } = usePaymentConfirmation(clientSecret);

  if (loading) return <Loading entire="entire" />;

  return (
    <PaymentConfirmationContent packageName={packageName} />
  );
};

PaymentConfirmation.propTypes = {
  clientSecret: PropTypes.string.isRequired
};

export default PaymentConfirmation;
