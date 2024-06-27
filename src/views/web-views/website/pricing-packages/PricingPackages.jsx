import {
  Col, Divider, Input, Radio, Row, Typography, notification, Carousel, Grid
} from 'antd';
import { SIGN_UP } from 'constants/AuthConstant';
import { BILLING_OPTIONS, SELECTED_PACKAGE_KEY } from 'constants/MiscConstant';
import { enterprisePackage, PlanType } from 'constants/PricingPackagesConstant';
import { sortBy, maxBy } from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SubscriptionService from 'services/SubscriptionService';
import { setValuesToLocalStorage } from 'utils/utils';
import { useSelector } from 'react-redux';
import Loading from 'components/shared-components/Loading';
import ROUTES from 'constants/RouteConstants';
import utils from 'utils';
import PricingPackageCard from './PricingPackageCard';
import { carouselSettings } from './CarouselSettings';

const { Title, Text } = Typography;
const defaultLicensesCount = 10;
const PricingPackages = (props) => {
  const { useBreakpoint } = Grid;
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
  const { isUpgrade } = props;
  const { FREE, MONTHLY, YEARLY } = BILLING_OPTIONS;
  const [processPayment, setProcessPayment] = useState(false);
  const [discountPercentageForPlans, setDiscountPercentageForPlans] = useState();
  const [activePlan, setActivePlan] = useState(null);
  const [billing, setBilling] = useState(YEARLY);
  const [numberOfUsers, setNumberOfUsers] = useState(defaultLicensesCount);
  const [plans, setPlans] = useState(null);
  const [maxPlanLicenses, setMaxPlanLicenses] = useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isUserLoggedIn = useSelector((state) => state.auth.token);
  const upgradeablePlans = (sortedPlans, activeSubscription) => {
    const upgradeableWebPlans = [...sortedPlans];
    const activePlanIndex = upgradeableWebPlans.findIndex(
      (x) => x.id === activeSubscription?.planId
    );
    // Add the isUpgradable property to plans for the upgradation packages.
    for (let i = 0; i < upgradeableWebPlans.length; i++) {
      upgradeableWebPlans[i].isUpgradeable = (i < activePlanIndex)
     || upgradeableWebPlans[i].basePrice === upgradeableWebPlans[activePlanIndex].basePrice;
    }
    return upgradeableWebPlans.filter((x) => x?.name?.toLowerCase() !== PlanType.FREE);
  };

  const getMatchingPlanPackages = (plan, billingType, usersCount) => {
    const matchingPlan = plan?.planPackages.find((x) => (
      x?.planPaymentCycleName?.toLowerCase() === billingType?.toLowerCase()
      && usersCount >= x.minUsers
      && usersCount <= x.maxUsers
    ));
    return matchingPlan;
  };

  const calculateDiscountedPrice = (usersCount, billingType) => {
    const discountPercentages = plans?.map((plan) => {
      if (plan.basePrice > 0) {
        const matchingPlan = getMatchingPlanPackages(plan, billingType, usersCount);
        return matchingPlan ? { [plan.name]: matchingPlan.discountPerc } : null;
      }
      return null;
    }).filter((x) => x !== null);
    setDiscountPercentageForPlans(discountPercentages);
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await SubscriptionService.getPlans();

        let sortedWebPlans = sortBy(response.data, 'basePrice');
        sortedWebPlans.push(enterprisePackage);
        // exclude the 'free' package if component is used for package-upgrade screen
        if (isUpgrade) {
          const activeSubscriptionPlan = await SubscriptionService.getActiveSubscription()
            .catch(() => { });
          if (activeSubscriptionPlan?.data) {
            setNumberOfUsers(activeSubscriptionPlan.data?.totalLicenses || defaultLicensesCount);
            setActivePlan(activeSubscriptionPlan.data);
          }
          sortedWebPlans = upgradeablePlans(sortedWebPlans, activeSubscriptionPlan?.data);
        }
        const filteredPlans = sortedWebPlans.filter(({ isUpgradeable }) => !isUpgradeable);
        const { maxLicenses } = maxBy(filteredPlans, 'maxLicenses') || {};
        setMaxPlanLicenses(maxLicenses);
        setPlans(sortedWebPlans);
      } catch (error) {
        notification.error({ message: error?.message });
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (plans && plans.length > 0) {
      calculateDiscountedPrice(numberOfUsers, MONTHLY);
    }
  }, [plans]);

  useEffect(() => {
    if (activePlan) {
      const { planPaymentCycle } = activePlan || {};
      const billingCycle = (planPaymentCycle === FREE || planPaymentCycle === MONTHLY)
        ? MONTHLY : planPaymentCycle;
      setBilling(billingCycle);
    }
  }, [activePlan]);

  const getPlanPackageId = (selectedPlanName) => {
    const planPackagesOfSelectedPackage = plans.find(
      (x) => x.name.toLowerCase() === selectedPlanName.toLowerCase()
    );
    const matchingPlan = getMatchingPlanPackages(
      planPackagesOfSelectedPackage,
      selectedPlanName === FREE ? FREE : billing,
      numberOfUsers
    );
    return matchingPlan?.id;
  };

  const handlePlanSelection = async (selectedPlan, price) => {
    const { name: planName, currency } = selectedPlan;
    const { freeTrial } = activePlan || {};
    // Calculate the full amount based on discountedPrice calculated based on (Year or Month)
    // Multiply the amount with numberOfUsers
    // const finalPriceBasedOnNumberOfUsers = (price * numberOfUsers).toFixed(2);
    const selectedPlanId = getPlanPackageId(planName);
    if (price > 0 && isUserLoggedIn) {
      try {
        setProcessPayment(true);
        if (freeTrial) {
          await SubscriptionService.getInvoice({
            planPackageId: selectedPlanId,
            licensesToPurchase: numberOfUsers
          });
          notification.success({ message: t('component.package.subscribed.confirmation.success') });
          setValuesToLocalStorage(
            SELECTED_PACKAGE_KEY,
            {
              packageName: planName,
              freeTrial
            }
          );
          navigate(`${ROUTES.PAYMENT_CONFIRMATION.path}?card_payment=success`);
        } else {
          navigate(`${ROUTES.PENDING_INVOICE.path}?selectedPlanId=${selectedPlanId}&numberOfUsers=${numberOfUsers}&planName=${planName}`);
        }
      } catch (error) {
        notification.error({ message: error?.message });
      } finally {
        setProcessPayment(false);
      }
    } else {
      setValuesToLocalStorage(
        SELECTED_PACKAGE_KEY,
        {
          packageName: planName,
          price,
          currency,
          billing: planName === FREE ? FREE : billing,
          planPackageId: selectedPlanId,
          noOfLicenses: numberOfUsers
        }
      );
      navigate(SIGN_UP);
    }
  };

  const handleUsersChange = (e) => {
    const { value } = e.target;
    if (value === '0' || parseInt(value, 10) < 0) return;
    setNumberOfUsers(value);
    calculateDiscountedPrice(value, billing);
  };
  const handleBillingChange = (e) => {
    const { value } = e.target;
    setBilling(value);
    calculateDiscountedPrice(numberOfUsers, e.target.value);
  };

  const renderPricingPlans = () => (
    plans.map((plan) => (
      <PricingPackageCard
        maxPlanLicenses={maxPlanLicenses}
        isUpgrade={isUpgrade}
        activePlan={activePlan}
        onPlanSelection={handlePlanSelection}
        discountPercentageForPlans={discountPercentageForPlans}
        billing={billing}
        numberOfUsers={numberOfUsers}
        key={plan.id}
        plan={plan} />
    ))
  );

  if (processPayment) return <Loading />;
  return (
    <div className="p-4" id="packages">
      <div className="align-center text-center pt-3">
        <p className="text-primary">{t('component.pricing.package.top.heading')}</p>
        <div className="d-flex justify-content-center">
          <Title className={`font-weight-bold ${isMobile && 'title-heading'}`}>{t('component.pricing.package.mid.heading')}</Title>
        </div>
        {!isUpgrade && (
          <p>
            {t('component.pricing.package.bottom.heading')}
          </p>
        )}
      </div>
      <Divider />
      <Row gutter={[16, 18]}>
        <Col className="d-flex flex-column justify-content-center align-items-center" xs={24}>
          <Title level={4}>{t('component.pricing.package.custom.users')}</Title>
          <Input
            onKeyPress={(event) => {
              if (event.code === 'Minus') {
                event.preventDefault();
              }
            }}
            id="licenses-input-field"
            onFocus={(e) => e.target.addEventListener('wheel', (ev) => { ev.preventDefault(); }, { passive: false })}
            onChange={handleUsersChange}
            value={numberOfUsers}
            className={`w-25 ${isMobile && 'w-75'}`}
            size="small"
            type="number" />
          {!numberOfUsers && <Text type="danger">{t('component.pricing.package.EnterLicenses.validation.message')}</Text>}
        </Col>
        <Col className="position-relative d-flex flex-column justify-content-center align-items-center" xs={24}>
          <Title level={4}>{t('component.pricing.package.subscription.choice')}</Title>
          <Radio.Group
            className="px-2 py-2 billing-radio-group d-flex justify-content-between align-items-center"
            optionType="button"
            onChange={handleBillingChange}
            value={billing}
            id="payment-cycle-options">
            <Radio id="payment-cycle-monthly-option" className={`${billing === MONTHLY ? 'monthly-text font-weight-bold' : ''}`} disabled={activePlan?.planPaymentCycle === YEARLY} value={MONTHLY}>{t('component.pricing.package.subscription.monthly')}</Radio>
            <Radio id="payment-cycle-yearly-option" className={`${billing === YEARLY ? 'yearly-text font-weight-bold' : 'font-weight-light'}`} value={YEARLY}>{t('component.pricing.package.subscription.yearly')}</Radio>
          </Radio.Group>
        </Col>
      </Row>
      <br />
      {
        plans?.length > 0 && (
          <Carousel
            className="mb-4"
            {...carouselSettings}>
            {renderPricingPlans()}
          </Carousel>
        )
      }
    </div>
  );
};

export default PricingPackages;
