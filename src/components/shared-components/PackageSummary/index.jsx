import React from 'react';
import PropTypes from 'prop-types';
import { Col, PageHeader, Row } from 'antd';
import { useTranslation } from 'react-i18next';

const PackageSummary = (props) => {
  const {
    packageName, currency, amount, billing
  } = props;
  const { t } = useTranslation();
  return (
    <>
      <PageHeader className="p-0" title={t('component.payment.intent.package.summary.label')} />
      <Row gutter={[16, 16]} className="mt-2">
        <Col>
          <strong>
            {`${t('component.payment.intent.package.label')}: `}
          </strong>
          <span className="ml-sm-2">{packageName?.toUpperCase()}</span>
        </Col>
        <Col>
          <strong>
            {`${t('component.payment.intent.price.label')}: `}
          </strong>
          <span className="ml-sm-2">{`${currency} ${amount}`}</span>
        </Col>
        <Col>
          <strong>
            {`${t('component.payment.intent.billing.label')}: `}
          </strong>
          <span className="ml-sm-2">{billing}</span>
        </Col>
      </Row>
    </>
  );
};

PackageSummary.propTypes = {
  packageName: PropTypes.string,
  currency: PropTypes.string,
  amount: PropTypes.string,
  billing: PropTypes.string
};

PackageSummary.defaultProps = {
  packageName: '',
  currency: '',
  amount: '',
  billing: ''
};

export default PackageSummary;
