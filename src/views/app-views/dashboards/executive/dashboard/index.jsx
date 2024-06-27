import React from 'react';
import { Col, Row } from 'antd';

import { GlobalProjectDonutChart } from './GolbalProjectStats-donut-chart';
import { ProjectOutlook } from './PojectOutlook-bar-chart';
import { ProjectPriorityOutlook } from './ProjectPriorityOutlook-bar-chart';
import { ProjectPriorityOverview } from './ProjectPriorityOverView-bar-chart';
import { ProjectDeliveryStats } from './ProjectDeliveryStats-line-chart';
import { ProjectConflictChart } from './ProjectConflict-bar-chart';
import { TeamCapacity } from './TeamCapacity-bar-chart';
import { BudgetChart } from './Budget-bar-chart';

const ExecutiveDashboard = () => (
  <>
    <Row gutter={[16, 4]}>
      <Col span={12}>
        <GlobalProjectDonutChart />
      </Col>
      <Col span={12}>
        <ProjectOutlook />
      </Col>
    </Row>
    <Row gutter={[16, 4]}>
      <Col span={12}>
        <ProjectPriorityOutlook />
      </Col>
      <Col span={12}>
        <ProjectPriorityOverview />
      </Col>
    </Row>
    <Row gutter={[16, 4]}>
      <Col span={12}>
        <ProjectDeliveryStats />
      </Col>
      <Col span={12}>
        <ProjectConflictChart />
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <TeamCapacity />
      </Col>
    </Row>
    <Row gutter={[16, 4]}>
      <Col span={12}>
        <BudgetChart />
      </Col>
    </Row>
  </>
);

export default ExecutiveDashboard;
