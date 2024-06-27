import React from 'react';
import {
  Card, Row, Col, Statistic, Typography
} from 'antd';
import { useTranslation } from 'react-i18next';
import CountUp from 'react-countup';

import './StatisticsStyles.css';
import { BILLING_STATUS_COLOURS } from 'constants/MiscConstant';
import { getBillingText, getValueColor } from 'utils/utils';

const { Title } = Typography;

const formatter = (value) => <CountUp end={value} separator="," duration={2} />;

const countStyle = {
  color: BILLING_STATUS_COLOURS.BLUE_BASE,
  fontSize: '36px',
  fontWeight: '600'
};

export default function StatisticsCard(props) {
  const { t } = useTranslation();
  const {
    totalLicenses, billingStatus, resourceTeamCount, conflictsCount
  } = props;

  const statusCountStyle = {
    ...countStyle,
    color: getValueColor(billingStatus)
  };

  return (
    <Row gutter={[12, 14]}>
      <Col span={6}>
        <Card className="statistic-card ">
          <Title level={4}>{t('component.user.dashboard.label.users')}</Title>
          <div className="pb-2">
            <Statistic
              value={totalLicenses}
              formatter={formatter}
              valueStyle={countStyle} />
          </div>
          <Title level={5}>{t('component.admin.dashboard.totalCount')}</Title>
        </Card>
      </Col>
      <Col span={6}>
        <Card className="statistic-card ">
          <Title level={4}>{t('component.admin.dashboard.billingStatus')}</Title>
          <div className="pb-2 d-flex">
            <Statistic value={billingStatus} formatter={formatter} valueStyle={statusCountStyle} />
            <span className="billing-status-text" style={{ color: getValueColor(billingStatus) }}>
              {getBillingText(billingStatus)}
            </span>
          </div>
          <Title level={5}>{t('component.admin.dashboard.totalCount')}</Title>
        </Card>
      </Col>
      <Col span={6}>
        <Card className="statistic-card ">
          <Title level={4}>{t('component.admin.dashboard.resourceTeams')}</Title>
          <div className="pb-2">
            <Statistic value={resourceTeamCount} formatter={formatter} valueStyle={countStyle} />
          </div>
          <Title level={5}>{t('component.admin.dashboard.totalCount')}</Title>
        </Card>
      </Col>
      <Col span={6}>
        <Card className="statistic-card ">
          <Title level={4}>{t('component.admin.dashboard.conflicts&Risks')}</Title>
          <div className="pb-2">
            <Statistic value={conflictsCount} formatter={formatter} valueStyle={countStyle} />
          </div>
          <Title level={5}>{t('component.admin.dashboard.totalCount')}</Title>
        </Card>
      </Col>
    </Row>
  );
}
