import {
  Button, Col, notification, Row, Spin
} from 'antd';
import { PAYMENT_OPTIONS, UPGRADE_PACKAGE } from 'configs/AppConfig';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import UserService from 'services/UserService';
import SubscriptionService from 'services/SubscriptionService';
import { Card } from 'components/shared-components/Card';
import DataTable from 'components/shared-components/DataTable';
import moment from 'moment';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';
import { SELECTED_PACKAGE_KEY, STRIPE_CURRENCY_USD } from 'constants/MiscConstant';
import { getValueFromLocalStorage, setValuesToLocalStorage } from 'utils/utils';
import ROUTES from 'constants/RouteConstants';
import { INVOICE_STATUS } from 'constants/StatusConstant';
import { billingTableColumns, getSubscriptionsBillingTableColumns, getPackageDetailsData } from './billingTableColumns';
import UpgradePackageModal from './UpgradePackageModal';
import BillingSectionContainer from './BillingSectionContainer';

const BillingCycleDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showUpgradePackageModal, setShowUpgradePackageModal] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [subscriptionsBilling, setSubscriptionsBilling] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [enterpriseUpgradeProcessing, setEnterpriseUpgradeProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [billingCycleLoader, setBillingCycleLoader] = useState(true);
  const selectedPackage = getValueFromLocalStorage() ?? {};
  const [invoiceDetails, setInvoiceDetails] = useState({});

  const { invoiceStatus } = invoiceDetails;
  const { PENDING_INVOICE } = ROUTES;

  const { NOT_PAID, OVERDUE } = INVOICE_STATUS;

  const isInvoiceOutstanding = [NOT_PAID, OVERDUE].includes(invoiceStatus);

  const onPageLoadInitialData = async () => {
    try {
      const [userCompanyData, subscriptionData, billingData] = await Promise.all(
        [
          UserService.getCompanyData(),
          SubscriptionService.getActiveSubscription().catch(
            (error) => notification.error({ message: error?.message })
          ),
          SubscriptionService.getSubscriptionsBilling()
        ]
      );
      setCompanyData(userCompanyData?.data);
      setActiveSubscription(subscriptionData?.data);
      setSubscriptionsBilling(billingData?.data);
    } catch (error) {
      notification.error({ message: error?.message || error });
    } finally {
      setBillingCycleLoader(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    onPageLoadInitialData();
  }, []);

  const getUserInvoice = async () => {
    try {
      setLoading(true);
      const { data = {} } = await SubscriptionService.getPendingInvoice();
      setInvoiceDetails(data);
    } catch (err) {
      if (err.code !== '1002') {
        notification.error({ message: err?.message });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInvoice();
  }, []);

  const handleClickUpgradePackage = () => {
    if (isInvoiceOutstanding) {
      return navigate(PENDING_INVOICE.path);
    }
    if (companyData?.companyType !== 'B2B') {
      return navigate(UPGRADE_PACKAGE);
    }
    setShowUpgradePackageModal(!showUpgradePackageModal);
  };

  const handleUpgradeEnterprisePlan = async (licenses) => {
    try {
      const {
        customerId, planId, planPaymentCycleId, productId, billingDate, totalAmountPerUser
      } = activeSubscription || {};
      const payload = {
        customerId,
        planId,
        planPaymentCycleId,
        productId,
        planType: subscriptionsBilling[0].planType,
        billingDate: moment(billingDate).format(DATE_FORMAT_DD_MM_YYYY),
        currencyCode: STRIPE_CURRENCY_USD,
        noOfLicenses: licenses,
        amountPerLicense: totalAmountPerUser,
        featureIds: []
      };
      setEnterpriseUpgradeProcessing(true);
      await SubscriptionService.upgradeEnterprisePlan(payload);
      const invoiceData = await SubscriptionService.getPendingInvoice();
      const {
        totalAmountToBeCharged, id, paymentPlan, planName
      } = invoiceData.data;

      setValuesToLocalStorage(
        SELECTED_PACKAGE_KEY,
        {
          ...selectedPackage,
          invoiceId: id,
          totalAmountToBeCharged,
          billing: paymentPlan,
          packageName: planName
        }
      );
      navigate(activeSubscription.freeTrial ? `${ROUTES.PAYMENT_CONFIRMATION.path}?card_payment=success` : PAYMENT_OPTIONS);
    } catch (error) {
      notification.error({ message: error?.message });
    } finally {
      setShowUpgradePackageModal(false);
      setEnterpriseUpgradeProcessing(false);
    }
  };

  return loading
    ? (
      <div style={{ height: 'calc(100vh - 200px)' }} className="d-flex justify-content-center align-items-center">
        <Spin />
      </div>
    )
    : (
      <>
        <Row gutter={24}>
          <Col span={12}>
            <BillingSectionContainer
              billingCycleLoader={billingCycleLoader}
              companyData={companyData}
              activeSubscription={activeSubscription} />
          </Col>
          <Col span={12}>
            <Card
              heading={t('sidenav.dashboard.billing')}
              actionBtn={(
                <>
                  <Button data-i="addPaymentButton" onClick={() => navigate(PENDING_INVOICE.path)} className="mt-2" id="add-payment-button">{t('component.billing.add.payment')}</Button>
                  <Button data-i="upgradeButton" onClick={handleClickUpgradePackage} className="mt-2" type="primary" id="upgrade-package-button">{t('component.billing.cycle.button.upgrade.text')}</Button>
                </>
              )}
              showBorder>
              <DataTable showScroll={false} id="label" className="table-header" pagination={false} columns={billingTableColumns()} data={getPackageDetailsData(companyData, activeSubscription)} />
            </Card>
          </Col>
        </Row>
        <Card id="billing-details" heading={t('component.admin.billing.dashboard.modal.title')} className="mt-4" type="primary" showBorder>
          <DataTable showScroll={false} id="invoiceDate" className="table-header" pagination={false} columns={getSubscriptionsBillingTableColumns()} data={subscriptionsBilling} />
        </Card>
        {showUpgradePackageModal && (
        <UpgradePackageModal
          onCloseModal={setShowUpgradePackageModal}
          onUpgradeEnterprisePlan={handleUpgradeEnterprisePlan}
          showModal={showUpgradePackageModal}
          existingNumberOfLicenses={companyData?.totalLicenses}
          processing={enterpriseUpgradeProcessing} />
        )}
      </>
    );
};

export default BillingCycleDashboard;
