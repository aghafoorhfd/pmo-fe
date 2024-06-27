import { Divider, Typography, Button } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'constants/RouteConstants';

const PaymentConfirmationContent = (props) => {
  const { BILLING_CYCLE } = ROUTES;
  const { packageName, freeTrial } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { Title } = Typography;

  const handleRefreshAndNavigate = () => {
    navigate(BILLING_CYCLE.path);
  };

  useEffect(() => () => {
    window.location.reload();
  }, []);

  return (
    <div className="text-center">
      <Title level={1}>
        {freeTrial ? t('component.package.subscribed.confirmation.heading')
          : t('component.payment.confirmation.heading')}

      </Title>
      <Divider />
      <div>
        {t('component.payment.confirmation.description', { package: packageName })}
      </div>
      <div>
        {t('component.payment.confirmation.statement', { package: packageName })}
      </div>
      <br />
      <div>{t('component.payment.confirmation.short.description')}</div>
      <Button onClick={handleRefreshAndNavigate} className="mt-2" type="primary">
        <ArrowLeftOutlined />
        {t('component.payment.confirmation.button.title')}
      </Button>
    </div>
  );
};

PaymentConfirmationContent.propTypes = {
  packageName: PropTypes.string.isRequired,
  freeTrial: PropTypes.bool
};
PaymentConfirmationContent.defaultProps = {
  freeTrial: false
};

export default PaymentConfirmationContent;
