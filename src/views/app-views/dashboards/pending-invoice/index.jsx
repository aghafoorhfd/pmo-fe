import React, { useEffect, useState, useMemo } from 'react';

import {
  Button, notification, Row, Col, Card, Image
} from 'antd';
import { useTranslation } from 'react-i18next';
import SubscriptionService from 'services/SubscriptionService';
import { useLocation } from 'react-router-dom';
import { STRIPE_CURRENCY_USD } from 'constants/MiscConstant';
import PaymentService from 'services/PaymentService';
import InvoiceDetail from './InvoiceDetail';

const useQueryParams = () => {
  const { search } = useLocation();
  return useMemo(() => {
    const params = new URLSearchParams(search);
    return {
      selectedPlanId: params.get('selectedPlanId'),
      numberOfUsers: params.get('numberOfUsers'),
      planName: params.get('planName')
    };
  }, [search]);
};

const Invoice = () => {
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const { selectedPlanId, numberOfUsers, planName } = useQueryParams();
  const { t } = useTranslation();

  const generateInvoice = async () => {
    try {
      setLoading(true);

      if (selectedPlanId && numberOfUsers) {
        const { data = {} } = await SubscriptionService.getInvoice({
          planPackageId: selectedPlanId,
          licensesToPurchase: numberOfUsers
        });
        setInvoiceData(data);
      } else {
        const { data = {} } = await SubscriptionService.getPendingInvoice();
        setInvoiceData(data);
      }
    } catch (err) {
      if (err.code !== '1002') {
        notification.error({ message: err?.message });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInvoice();
  }, []);

  const paymentHandler = async () => {
    try {
      const payload = await PaymentService.createSession({
        amount: invoiceData.totalAmountToBeCharged,
        packageName: invoiceData.planName ? invoiceData.planName : planName,
        invoiceId: invoiceData.id,
        currency: STRIPE_CURRENCY_USD
      });
      window.location.href = payload?.data;
    } catch (error) {
      notification.error({ message: error.message });
    }
  };

  return (
    <Card>
      <Row justify="end" className="mb-3">
        <Col lg={12}>
          <Image
            preview={false}
            src="/img/pmo-logo.png"
            width={180} />
        </Col>
        <Col lg={12} className="mt-3 text-right">
          <Button id="add-payment-btn" disabled={Object.keys(invoiceData).length <= 0} onClick={paymentHandler}>{t('component.billing.processed.for.payment')}</Button>
        </Col>
      </Row>
      <InvoiceDetail invoiceData={invoiceData} loading={loading} />
    </Card>
  );
};

export default Invoice;
