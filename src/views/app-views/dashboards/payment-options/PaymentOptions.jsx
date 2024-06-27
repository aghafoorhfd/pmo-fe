import {
  PageHeader, Row, Button, notification, Radio
} from 'antd';
import Loading from 'components/shared-components/Loading';
import { BILLING_HISTORY, PAYMENT_INTENT } from 'configs/AppConfig';
import { SELECTED_PACKAGE_KEY, STRIPE_CURRENCY_USD } from 'constants/MiscConstant';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import PaymentService from 'services/PaymentService';
import { getValueFromLocalStorage, setValuesToLocalStorage } from 'utils/utils';
import './index.css';

import Modal from 'components/shared-components/Modal';
import PackageSummary from 'components/shared-components/PackageSummary';
import ROUTES from 'constants/RouteConstants';
import PaymentCards from './PaymentCards';

const PaymentOptions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, cardId: null });
  const [selectedCardId, setSelectedCardId] = useState(null);

  const selectedPackage = getValueFromLocalStorage(SELECTED_PACKAGE_KEY);

  const {
    billing, currency, packageName, invoiceId,
    totalAmountToBeCharged: totalAmount
  } = selectedPackage || {};

  const updateDefaultCard = (cardList) => {
    const defaultCard = cardList.find((card) => card.defaultCard);
    setSelectedCardId(defaultCard?.cardId);
  };

  const fetchCardDetails = async () => {
    setIsLoading(true);
    try {
      const response = await PaymentService.getActivatedCard().catch(() => null);
      if (packageName) {
        const { data: { customerId, paymentIntentId, clientSecret } } = await

        PaymentService.createPaymentIntent(
          { amount: totalAmount, currency: STRIPE_CURRENCY_USD }
        );
        setValuesToLocalStorage(
          SELECTED_PACKAGE_KEY,
          {
            ...selectedPackage,
            invoiceId,
            paymentIntentId,
            clientSecret,
            customerId,
            totalAmountToBeCharged: totalAmount
          }
        );
      }

      if (response?.data?.length > 0) {
        setCards(response.data);
        updateDefaultCard(response?.data);
      } else {
        navigate(PAYMENT_INTENT);
      }
    } catch (error) {
      setApiError(error);
      notification.error({ message: error?.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCardDetails();
  }, []);

  const handlePayNow = async () => {
    setIsPaymentProcessing(true);
    try {
      await PaymentService.payWithCard(selectedCardId, {
        amount: totalAmount,
        currency: STRIPE_CURRENCY_USD,
        invoiceId
      });
      notification.success({ message: t('component.payment.confirmation.success') });
      navigate(`${ROUTES.PAYMENT_CONFIRMATION.path}?card_payment=success`);
    } catch (error) {
      notification.error({ message: error?.message });
    } finally {
      setIsPaymentProcessing(false);
      setShowModal(false);
    }
  };

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const handleDeleteCard = async () => {
    const { cardId } = deleteModal;
    try {
      setIsDeleting(true);
      await PaymentService.deleteCard(cardId);
      if (cardId === selectedCardId) setSelectedCardId(null);
      const response = await PaymentService.getActivatedCard();
      if (response && response?.data?.length > 0) {
        setCards(response.data);
        updateDefaultCard(response.data);
      } else {
        navigate(packageName ? PAYMENT_INTENT : BILLING_HISTORY);
      }
      notification.success({ message: t('component.card.details.delete.success.message') });
    } catch (error) {
      notification.error({ message: error?.message });
    } finally {
      setIsDeleting(false);
      setDeleteModal({ cardId: null, show: false });
    }
  };

  const handlePayWithNewCard = () => {
    if (cards.length >= 5) {
      return notification.error({ message: t('component.card.details.more.cards.error') });
    }
    navigate(PAYMENT_INTENT);
  };

  if (loading) return <Loading />;

  if (apiError) {
    return (
      <>
        <Loading />
        <Navigate to={BILLING_HISTORY} />
      </>
    );
  }

  const setAsDefault = async ({ cardId }) => {
    try {
      await PaymentService.defaultCard(cardId);
      fetchCardDetails();
      notification.success({ message: t('component.card.details.setAsDefault.success.message') });
    } catch (error) {
      notification.error({ message: error?.message });
    }
  };

  if (cards && cards.length > 0) {
    return (
      <>
        {packageName && (
        <PackageSummary
          packageName={packageName}
          currency={currency}
          amount={totalAmount}
          billing={billing} />
        )}
        <PageHeader className="pl-2" title={t('component.payment.intent.card.details.heading')} />
        <Radio.Group className="w-100" name="cards" onChange={(e) => setSelectedCardId(e.target.value)} value={selectedCardId}>
          <PaymentCards
            cards={cards}
            loading={loading}
            setDeleteModal={setDeleteModal}
            setAsDefault={setAsDefault} />
        </Radio.Group>

        {packageName && (
        <Row align="middle" justify="end">
          <Button id="new-card-button" disabled={isPaymentProcessing} onClick={handlePayWithNewCard} className="m-2" type="secondary">
            {t('component.card.details.button.new.card')}
          </Button>
          <Button id="existing-card-button" disabled={isPaymentProcessing || !selectedCardId} onClick={() => handleShowModal()} type="primary">
            {t('component.card.details.button.pay.now')}
          </Button>
        </Row>
        )}
        <Modal
          title={t('component.common.payment.confirmation.title')}
          description={t('component.common.payment.confirmation')}
          isOpen={showModal}
          destroyOnClose
          confirmLoading={isPaymentProcessing}
          cancelButtonProps={{ disabled: isPaymentProcessing }}
          okButtonProps={{ disabled: isPaymentProcessing }}
          onCancel={() => setShowModal(false)}
          okText={t('component.card.details.button.pay.now')}
          onOk={handlePayNow} />
        <Modal
          title={t('component.common.payment.confirmation.delete.card.title')}
          description={t('component.common.payment.card.delete.confirmation')}
          isOpen={deleteModal.show}
          okButtonProps={{ disabled: isDeleting }}
          onCancel={() => setDeleteModal({ cardId: null, show: false })}
          okText={t('component.card.details.button.delete')}
          onOk={handleDeleteCard} />
      </>
    );
  }
};

export default PaymentOptions;
