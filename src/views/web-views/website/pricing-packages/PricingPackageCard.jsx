import {
  Button,
  Card
} from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PlanType } from 'constants/PricingPackagesConstant';
import { BILLING_OPTIONS } from 'constants/MiscConstant';
import './index.css';
import { toFixedNoRounding } from 'utils/utils';
import { contactSupportEmail } from 'mock/data/faqAndSupportData';

const PricingPackageCard = (props) => {
  const {
    plan, onPlanSelection,
    discountPercentageForPlans, billing, numberOfUsers, isUpgrade, activePlan, maxPlanLicenses
  } = props;
  const isUserLoggedIn = !!useSelector((state) => state.auth.token);
  const {
    name: planName, features, basePrice, maxLicenses
  } = plan;
  const { t } = useTranslation();
  const { FREE, YEARLY } = BILLING_OPTIONS;
  const [showContact, setShowContact] = useState(null);
  const [isPlanHighlighted, setIsPlanHighlighted] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  const getButtonText = () => (planName?.toLowerCase() === PlanType.FREE ? t('component.pricing.package.button.startNow') : t('component.pricing.package.button.freemium'));

  const buttonMap = {
    true: plan?.isEnterprise ? t('component.pricing.package.button.enterprise') : t('component.pricing.package.button.common'),
    false: plan?.isEnterprise ? t('component.pricing.package.button.enterprise') : getButtonText()
  };

  const isActivePlan = plan?.id === activePlan?.planId;

  const isPlanUpgradeable = () => (plan?.isUpgradeable);
  const isUserLicensesInRange = (noOfUsers) => (noOfUsers ? noOfUsers >= 1 && noOfUsers
   <= maxLicenses : !!noOfUsers);

  const highlightPlan = () => {
    const isEnterprisePlan = planName?.toLowerCase() === PlanType.ENTERPRISE;
    let isLicensesInRange = isUserLicensesInRange(numberOfUsers);
    if (isUpgrade && isPlanUpgradeable()) {
      isLicensesInRange = false;
    }
    return (
      (isUpgrade && plan?.id === activePlan?.planId)
      || isLicensesInRange
      || (isEnterprisePlan && numberOfUsers > maxPlanLicenses)
    );
  };

  const calculateDiscountedPricePerUser = (price) => {
    if (price > 0 && discountPercentageForPlans) {
      const discountPlan = discountPercentageForPlans.find((discounts) => planName in discounts);
      if (discountPlan) {
        const discountedAmount = discountPlan[planName] > 0
          ? basePrice - (basePrice * (discountPlan[planName])) : basePrice;
        const calculateTotalDiscountedAmount = billing
        === YEARLY ? discountedAmount * 12 : discountedAmount;

        return calculateTotalDiscountedAmount;
      }
    }
    const roundedPrice = billing === YEARLY ? price * 12 : price;
    return roundedPrice;
  };
  const isPlanDiscounted = (reducedPrice) => {
    if (plan?.isEnterprise) {
      return false;
    }
    const calculatedDiscountedPrice = billing === YEARLY ? basePrice * 12 : basePrice;
    const formattedDiscountedPrice = calculatedDiscountedPrice;
    return reducedPrice !== formattedDiscountedPrice;
  };

  useEffect(() => {
    if (!plan?.isEnterprise) {
      const reducedPrice = calculateDiscountedPricePerUser(basePrice);
      setIsDiscounted(isPlanDiscounted(reducedPrice));
      setDiscountedPrice(reducedPrice);
    }
    setIsPlanHighlighted(highlightPlan());
  }, [plan, discountPercentageForPlans]);

  const handleClickPlan = (selectedPlan) => {
    if (t(selectedPlan?.name).toLowerCase() === PlanType.ENTERPRISE) {
      setShowContact(contactSupportEmail);
      return;
    }
    onPlanSelection(selectedPlan, discountedPrice);
  };

  const getDescription = () => {
    const billingDescription = billing === YEARLY ? t('component.pricing.package.description.year.common')
      : t('component.pricing.package.description.month.common');

    return billingDescription;
  };

  const getSubscriptionPeriodText = () => {
    const subscriptionPeriodText = billing === YEARLY ? t('component.pricing.package.description.annually.common')
      : t('component.pricing.package.description.monthly.common');
    return subscriptionPeriodText;
  };

  const calculateTotalPrice = () => {
    const pricePerUser = discountedPrice;
    let totalPrice = 0;

    if (pricePerUser) {
      totalPrice = toFixedNoRounding(2, (numberOfUsers * pricePerUser));
    }
    if (planName === FREE) {
      return t('component.pricing.package.description.lifetime.free');
    }
    if (planName === FREE || billing !== YEARLY) {
      return `$${totalPrice} / monthly`;
    }
    if (billing === YEARLY) {
      return `$${totalPrice} / yearly`;
    }
  };

  const recommendedBadge = () => (
    planName?.toLowerCase() === PlanType.PREMIUM && <div className="recommended-badge mb-2 font-weight-bold">{t('component.pricing.package.recommended.text')}</div>
  );

  const getDiscountPriceTitle = () => (
    <div className="price-section package-font-weight package-font-color mt-2 mb-2">
      <h3 className="mt-3 text-decoration-underline">{planName?.toUpperCase()}</h3>
      <div>
        {plan?.isEnterprise ? (
          <img src="/enterprise.svg" alt="" className="p-3" />
        ) : (
          <>
            {isDiscounted && <span className="diagonal_line_through">{`$${billing === YEARLY ? basePrice * 12 : basePrice}`}</span>}
            <span>
              {`$${toFixedNoRounding(2, discountedPrice)}`}
            </span>
          </>

        )}
      </div>
    </div>
  );

  const getSubscriptionText = () => (
    <div className="font-size-md">
      <div className={`description-info ${planName?.toLowerCase() === PlanType.ENTERPRISE && 'font-weight-bold'}`}>{planName?.toLowerCase() === PlanType.ENTERPRISE ? t('component.pricing.package.description.custom') : getDescription()}</div>
      <div className="package-font-weight mb-2 package-font-color">
        {!plan?.isEnterprise && calculateTotalPrice()}
      </div>
      <div className="description-info mb-2">{(planName?.toLowerCase() === PlanType.STANDARD || planName?.toLowerCase() === PlanType.PREMIUM) && getSubscriptionPeriodText()}</div>
    </div>
  );

  const getPlanNames = () => (
    <div className={`package-section d-flex flex-column align-items-center justify-content-around text-center px-3 ${isPlanHighlighted ? 'selected-package-section' : ''}`}>
      {getDiscountPriceTitle()}
      {getSubscriptionText()}
      <Button id={`get-started-${planName}`} disabled={!plan?.isEnterprise ? (!isPlanHighlighted || !isUserLicensesInRange(numberOfUsers)) : false} onClick={() => handleClickPlan(plan)} className={`selected-package-bg mb-4 d-flex align-items-center package-btn font-size-md ${isPlanHighlighted ? 'selected-package-font-color selected-package-bg' : ''} ${isActivePlan ? 'selected-package-font-color active-button-selected-package-bg' : ''}`}>
        {(plan?.isEnterprise && showContact) ? showContact : buttonMap[isUserLoggedIn]}
      </Button>
    </div>
  );

  const getPlanFeatures = () => features?.map(({ name, id }, index) => (
    <div key={id ? `${id}_${index}` : name} className={`feature-item d-flex align-items-center pl-3 pt-4 ${isActivePlan && 'active-plan-text-color'}`}>
      <img src="/card-icons.svg" alt={name} className={`${isActivePlan && 'active-plan-text-color'}`} />
      <div className={`pl-2 feature-info ${isActivePlan && 'active-plan-text-color'}`}>
        {plan?.isEnterprise ? t(name) : name}
      </div>
    </div>
  ));

  return (
    <>
      {recommendedBadge()}
      <div className={`p-2 ${(plan?.isEnterprise || isPlanHighlighted) && !isActivePlan ? 'card-border-highlighted' : ''} ${isActivePlan ? 'active-card-border' : ''} ${planName?.toLowerCase() !== PlanType.PREMIUM && 'mt-5'}`}>
        <Card
          className={`plan-card m-0 ${isActivePlan && 'active-plan-background-color'} ${isPlanHighlighted ? 'selected-plan-card-container' : 'unselected-plan'}`}>
          {getPlanNames()}
          <div className="pb-4 pr-4 overflow-auto card-border-radius">
            {getPlanFeatures()}
          </div>
        </Card>
      </div>
    </>
  );
};

PricingPackageCard.propTypes = {
  plan: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  onPlanSelection: PropTypes.func.isRequired,
  billing: PropTypes.string.isRequired,
  isUpgrade: PropTypes.bool
};

PricingPackageCard.defaultProps = {
  isUpgrade: false
};

export default PricingPackageCard;
