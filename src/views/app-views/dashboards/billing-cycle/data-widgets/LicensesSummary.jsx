import React from 'react';
import { Row, Col } from 'antd';
import { getRemainingLicenses } from 'utils/utils';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const LicensesSummary = ({ companyData }) => {
  const { t } = useTranslation();
  return (
    <Row gutter={8} className="border-top mt-5">
      <Col className="text-center flex-column justify-content-center p-3 align-items-center" span={12}>
        <div className="font-size-base">{t('component.billing.profile.total.license')}</div>
        <div className="text-black font-size-xxl font-weight-semibold">{companyData?.totalLicenses || 0}</div>
      </Col>
      <Col className="border-left text-center flex-column p-3 justify-content-center align-items-center" span={12}>
        <div className="font-size-base">{t('component.billing.profile.remaining.license')}</div>
        <div className="text-black font-size-xxl font-weight-semibold">
          {getRemainingLicenses(companyData)}
        </div>
      </Col>
    </Row>
  );
};
LicensesSummary.propTypes = {
  companyData: PropTypes.shape({
    totalLicenses: PropTypes.number
  }).isRequired
};

export default LicensesSummary;
