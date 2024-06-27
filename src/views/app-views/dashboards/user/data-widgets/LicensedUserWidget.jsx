import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, Row, Empty, Skeleton,
  notification
} from 'antd';
import { Card } from 'components/shared-components/Card';
import DonutChartWidget from 'components/shared-components/DonutChartWidget';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UPGRADE_PACKAGE, PAYMENT_OPTIONS } from 'configs/AppConfig';
import { getUserLicenses, hideUserMessage } from 'store/slices/userSlice';
import PropTypes from 'prop-types';
import Loading from 'components/shared-components/Loading';
import SubscriptionService from 'services/SubscriptionService';
import { INVOICE_STATUS } from 'constants/StatusConstant';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';
import { SELECTED_PACKAGE_KEY, STRIPE_CURRENCY_USD } from 'constants/MiscConstant';
import { getValueFromLocalStorage, setValuesToLocalStorage } from 'utils/utils';
import ROUTES from 'constants/RouteConstants';
import { COLORS } from 'constants/ChartConstant';
import moment from 'moment';
import UpgradePackageModal from '../../billing-cycle/UpgradePackageModal';

const LicensedUserWidget = ({ usersPieChartCount, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasData = !loading && usersPieChartCount?.totalSum > 0;
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [showUpgradePackageModal, setShowUpgradePackageModal] = useState(false);
  const [enterpriseUpgradeProcessing, setEnterpriseUpgradeProcessing] = useState(false);
  const selectedPackage = getValueFromLocalStorage(SELECTED_PACKAGE_KEY) || {};
  const {
    user: {
      totalLicenses, remainingLicenses, message, showMessage, companyData, companyDataLoading
    }
  } = useSelector((state) => ({
    user: state.user
  }));
  const { NOT_PAID } = INVOICE_STATUS;

  const getSubscriptionAndInvoiceData = async () => {
    try {
      const [invoiceData, subscriptionData] = await Promise.all(
        [
          SubscriptionService.getPendingInvoice().catch(
            (error) => error.code !== '1002' && notification.error({ message: error?.message })
          ),
          SubscriptionService.getActiveSubscription()
        ]
      );
      setInvoiceDetails(invoiceData);
      setActiveSubscription(subscriptionData?.data);
    } catch (error) {
      notification.error({ message: error?.message || error });
    } finally {
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    getSubscriptionAndInvoiceData();
  }, []);

  useEffect(() => {
    const successMessages = [
      t('component.user.dashboard.revoke.message'),
      t('component.user.dashboard.reActivate.message'),
      t('component.user.dashboard.userAdded.success.message')
    ];
    if (showMessage && successMessages.includes(message)) {
      dispatch(getUserLicenses());
    }
    dispatch(hideUserMessage());
  }, [showMessage]);

  const handleBuyMoreLicense = () => {
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
      setEnterpriseUpgradeProcessing(true);
      await SubscriptionService.upgradeEnterprisePlan(payload);
      const {
        totalAmountToBeCharged, id, paymentPlan, planName
      } = invoiceDetails.data;

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

  const buyMoreLicenseBtn = () => (
    subscriptionLoading || companyDataLoading
      ? <Skeleton.Button active style={{ width: '220px' }} />
      : (
        <Button
          onClick={handleBuyMoreLicense}
          type="link"
          className="font-weight-semibold"
          icon={<PlusOutlined />}
          id="buy-more-licenses">
          {t('component.user.dashboard.buyMoreLicense')}
        </Button>
      )
  );
  const getLicenseMessage = (remainingLicense) => {
    if (remainingLicense === 0) {
      return t('component.user.dashboard.remainingLicense.zero.message');
    } if (remainingLicense === 2 || remainingLicense === 1) {
      return t('component.user.dashboard.remainingLicense.message');
    }
    return null;
  };

  return (
    <>
      <Card
        heading={t('component.user.dashboard.widget.licensed.heading')}
        description={t('component.user.dashboard.widget.description')}
        tagText={`${totalLicenses - remainingLicenses} ${t('component.user.dashboard.label.users')}`}
        actionBtn={buyMoreLicenseBtn()}
        showBorder>
        <div style={{ height: '360px', display: !hasData ? 'grid' : '' }}>
          <p className="text-center font-weight-semibold mb-2">{t('component.user.dashboard.title.license.details')}</p>
          {loading && <Loading />}
          {
          hasData
            && (
              <>
                <DonutChartWidget
                  series={usersPieChartCount?.series}
                  labels={usersPieChartCount?.labels}
                  customOptions={{
                    colors: [COLORS[11], remainingLicenses < 3 ? COLORS[12] : COLORS[9]],
                    legend: {
                      show: true,
                      position: 'right',
                      offsetY: 50,
                      offsetX: 0,
                      onItemHover: {
                        highlightDataSeries: false
                      }
                    }
                  }} />
                {
               !loading && !hasData && <Empty />
              }
                <div className="text-center mb-2">
                  <span className="text-danger text-center">
                    {getLicenseMessage(remainingLicenses)}
                  </span>
                </div>
              </>
            )
        }

          <Row className="border-top">
            <Col span={12} className="border-right">
              <div className="text-center flex-column justify-content-center align-items-center ">
                <div className="font-size-base mt-2">{t('component.user.dashboard.totalLicense')}</div>
                <div className="text-black font-size-xxl font-weight-semibold pb-2">
                  {totalLicenses}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="text-center flex-column justify-content-center align-items-center">
                <div className="font-size-base mt-2">{t('component.user.dashboard.remainingLicense')}</div>
                <div className="text-black font-size-xxl font-weight-semibold pb-2">
                  {remainingLicenses}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
      {showUpgradePackageModal && (
      <UpgradePackageModal
        onCloseModal={setShowUpgradePackageModal}
        onUpgradeEnterprisePlan={handleUpgradeEnterprisePlan}
        showModal={showUpgradePackageModal}
        existingNumberOfLicenses={totalLicenses}
        processing={enterpriseUpgradeProcessing} />
      )}
    </>
  );
};

LicensedUserWidget.propTypes = {
  usersPieChartCount: PropTypes.shape({
    series: PropTypes.arrayOf(PropTypes.number).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    totalCount: PropTypes.number
  }).isRequired,
  loading: PropTypes.bool.isRequired
};

export default LicensedUserWidget;
