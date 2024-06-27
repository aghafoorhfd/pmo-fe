import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useElements, useStripe
} from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import {
  Alert,
  Button, Divider, notification, PageHeader
} from 'antd';
import { useTranslation } from 'react-i18next';
import { PAYMENT_CONFIRMATION_URL } from 'constants/ApiConstant';
import Modal from 'components/shared-components/Modal';
import PackageSummary from 'components/shared-components/PackageSummary';

const PaymentIntentDashboard = ({ selectedPackage, totalAmountToBeCharged }) => {
  const {
    packageName, currency, billing
  } = selectedPackage;
  const [showModal, setShowModal] = useState(false);
  const [alertBanner, setAlertBanner] = useState(true);
  const [isPaymentInProcess, setIsPaymentInProcess] = useState(false);
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const timer = setInterval(() => {
      setAlertBanner(false);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleConfirmation = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = async (event) => {
    setIsPaymentInProcess(true);
    try {
      event.preventDefault();
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // eslint-disable-next-line camelcase
          return_url: `${window.location.origin}${PAYMENT_CONFIRMATION_URL}`
        }
      });
      if (result.error) {
        setShowModal(false);
        setIsPaymentInProcess(false);
        notification.error({ message: result.error.message });
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    } catch (error) {
      setShowModal(false);
      setIsPaymentInProcess(false);
      notification.error({ message: error?.message });
    }
  };

  return (
    <>

      <PackageSummary
        packageName={packageName}
        currency={currency}
        amount={totalAmountToBeCharged}
        billing={billing} />
      <Divider />
      <PageHeader className="p-0 mb-2" title={t('component.payment.intent.card.details.heading')} />
      {
        alertBanner && (<Alert className="p-3 mb-2" message={t('component.payment.intent.alerBanner.message')} type="warning" showIcon closable />)
      }
      <form>
        <PaymentElement />
        <Button className="mt-3" disabled={!stripe} type="primary" onClick={handleConfirmation}>{t('component.payment.intent.pay.now.label')}</Button>
      </form>
      <Modal
        title={t('component.common.payment.confirmation.title')}
        description={t('component.common.payment.confirmation')}
        isOpen={showModal}
        destroyOnClose
        confirmLoading={isPaymentInProcess}
        onCancel={() => setShowModal(false)}
        cancelButtonProps={{ disabled: isPaymentInProcess }}
        okButtonProps={{ disabled: isPaymentInProcess }}
        okText={t('component.card.details.button.pay.now')}
        onOk={handleSubmit} />
    </>
  );
};

PaymentIntentDashboard.propTypes = {
  selectedPackage: PropTypes.shape({
    packageName: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    billing: PropTypes.string.isRequired
  }).isRequired,
  totalAmountToBeCharged: PropTypes.number.isRequired
};

export default PaymentIntentDashboard;
