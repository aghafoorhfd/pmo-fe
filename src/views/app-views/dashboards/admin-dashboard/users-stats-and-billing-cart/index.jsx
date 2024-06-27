import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, Button, notification, Empty
} from 'antd';
import moment from 'moment';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Card } from 'components/shared-components/Card';
import DonutChartWidget from 'components/shared-components/DonutChartWidget';

import {
  BILLING_OPTIONS, SELECTED_PACKAGE_KEY, STRIPE_CURRENCY_USD
} from 'constants/MiscConstant';
import ROUTES from 'constants/RouteConstants';
import { PAYMENT_OPTIONS, UPGRADE_PACKAGE } from 'configs/AppConfig';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_MMM_DD_YYYY_WITH_COMMA } from 'constants/DateConstant';
import { getValueFromLocalStorage, setValuesToLocalStorage } from 'utils/utils';
import { upgradeEnterprisePlan } from 'store/slices/subscriptionSlice';
import { INVOICE_STATUS } from 'constants/StatusConstant';
import SubscriptionService from 'services/SubscriptionService';
import Loading from 'components/shared-components/Loading';
import UpgradePackageModal from '../../billing-cycle/UpgradePackageModal';

export default function UserStatsWithBillingCart(props) {
  const {
    companyData,
    userStats,
    userStatsLoading,
    activeSubscription,
    subcriptionLoading
  } = props;

  const {
    subscription: {
      enterpriseUpgradeProcessing
    }
  } = useSelector((state) => ({ subscription: state.subscription }));

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [invoiceLoading, setInvoiceLoading] = useState(true);
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [showUpgradePackageModal, setShowUpgradePackageModal] = useState(false);
  const selectedPackage = getValueFromLocalStorage(SELECTED_PACKAGE_KEY) || {};
  const { NOT_PAID } = INVOICE_STATUS;

  const formatAmount = () => (activeSubscription?.totalAmountPerMonth ? `$ ${activeSubscription?.totalAmountPerMonth.toFixed(2)}` : t('component.common.notAvailable'));
  const renderEndDate = () => {
    if (activeSubscription?.nextBillingDate
        && activeSubscription.planPaymentCycle !== BILLING_OPTIONS.FREE) {
      return (
        <div className="font-size-base">
          <span className="mr-1">{t('component.common.on.label')}</span>
          {moment(activeSubscription?.nextBillingDate).format(DATE_FORMAT_MMM_DD_YYYY_WITH_COMMA)}
        </div>
      );
    }
    return null;
  };

  const handleClickUpgradePackage = () => {
    const { invoiceStatus } = invoiceDetails;

    if (invoiceStatus === NOT_PAID) {
      return navigate(ROUTES.PENDING_INVOICE.path);
    }
    if (companyData?.companyType !== 'B2B') {
      return navigate(UPGRADE_PACKAGE);
    }
    setShowUpgradePackageModal(!showUpgradePackageModal);
  };

  const handleUpgradeEnterprisePlan = async (licenses) => {
    try {
      const {
        customerId, planId, planPaymentCycleId, productId, billingDate, totalAmountPerUser, planType
      } = activeSubscription || {};
      const payload = {
        customerId,
        planId,
        planPaymentCycleId,
        productId,
        planType,
        billingDate: moment(billingDate).format(DATE_FORMAT_DD_MM_YYYY),
        currencyCode: STRIPE_CURRENCY_USD,
        noOfLicenses: licenses,
        amountPerLicense: totalAmountPerUser,
        featureIds: []
      };

      dispatch(upgradeEnterprisePlan(payload));

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
    }
  };

  const getUserInvoice = async () => {
    try {
      const { data = {} } = await SubscriptionService.getPendingInvoice();
      setInvoiceDetails(data);
    } catch (err) {
      if (err.code !== '1002') {
        notification.error({ message: err?.message });
      }
    } finally {
      setInvoiceLoading(false);
    }
  };

  useEffect(() => {
    getUserInvoice();
  }, []);

  const donutCard = () => (
    <Card
      heading={t('component.admin.dashboard.cart.heading.userStatus')}
      description={t('component.admin.dashboard.cart.subHeading')}
      showBorder>
      <div style={{ height: '258px' }}>
        {userStatsLoading ? (<Loading />) : null}
        {!userStatsLoading && Object.keys(userStats)?.length > 0 ? (
          <DonutChartWidget
            series={userStats?.series}
            labels={userStats?.labels}
            customOptions={{
              colors: userStats?.colors,
              legend: {
                show: true,
                position: 'right',
                offsetY: 50,
                offsetX: 0
              }
            }} />
        ) : (<Empty />)}
      </div>
    </Card>
  );

  const billingDetailsCard = () => (
    <Card
      heading={t('component.admin.billing.dashboard.modal.title')}
      description={t('component.admin.dashboard.subHeading.billingDetails')}
      showBorder>
      <div style={{ height: '258px' }}>
        {subcriptionLoading || invoiceLoading ? (<Loading />)
          : (
            <>
              <Row>
                <div className="mb-3 text-black font-weight-semibold font-size-md">{t('component.billing.details.next.payment')}</div>
              </Row>
              <Row className="d-flex flex-column pt-3">
                <div>
                  <div className="font-size-xxl font-weight-semibold text-info">
                    {formatAmount()}
                  </div>
                  {renderEndDate()}
                </div>
              </Row>
              <Row className="pt-5">
                <Button data-i="upgradeButton" onClick={handleClickUpgradePackage} className="mt-2" type="primary">{t('component.admin.dashboard.button.text.request.additional.licences')}</Button>
              </Row>
            </>
          )}
      </div>
    </Card>
  );

  return (
    <Row gutter={[16, 4]}>
      <Col span={12}>
        {donutCard()}
      </Col>
      <Col span={12}>
        {billingDetailsCard()}
      </Col>
      {showUpgradePackageModal && (
      <UpgradePackageModal
        onCloseModal={setShowUpgradePackageModal}
        onUpgradeEnterprisePlan={handleUpgradeEnterprisePlan}
        showModal={showUpgradePackageModal}
        existingNumberOfLicenses={companyData?.totalLicenses}
        processing={enterpriseUpgradeProcessing} />
      )}
    </Row>
  );
}
