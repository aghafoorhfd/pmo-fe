import {
  Row, Col, Empty
} from 'antd';
import React, { useEffect, useState } from 'react';
import '../MyProjects.css';
import { COLORS } from 'constants/ChartConstant';
import { Card } from 'components/shared-components/Card';
import { useTranslation } from 'react-i18next';
import DonutChartWidget from 'components/shared-components/DonutChartWidget';
import { calculateQuarterData, calculateSpentAndRemainingHours } from 'utils/utils';
import { useSelector } from 'react-redux';
import TeamBulletin from 'components/shared-components/TeamBulletin';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import MyRisksStats from './MyRisksStats';
import SprintAllocationWidget from './SprintAllocationWidget';
import JiraPendingWorkWidget from './JiraPendingWorkWidget';

const MyProjectStatus = ({ cadenceType }) => {
  const [calculateCurrrentSprint, setCalculateCurrentSprint] = useState({
    lastDayMessage: '', labels: [], remainingHours: 0, spentHours: 0
  });
  const [calculateQuarterSprint, setCalculateQuarterSprint] = useState({
    spentDays: 0, remainingDays: 0, quarterSprintLabels: []
  });
  const { t } = useTranslation();
  const isCadenceType = cadenceType === methodologyType.AGILE_CAPS;
  const {
    lastDayMessage,
    labels,
    remainingHours,
    spentHours
  } = calculateCurrrentSprint;
  const {
    spentDays,
    remainingDays,
    quarterSprintLabels
  } = calculateQuarterSprint;
  const {
    projectCadence: {
      agile,
      sdlc
    } = {}
  } = useSelector(({ projectDetails }) => projectDetails);

  const { currentHalfSprints } = agile || {};
  const { quarters } = sdlc || {};

  useEffect(() => {
    if (isCadenceType) {
      setCalculateCurrentSprint(calculateSpentAndRemainingHours(currentHalfSprints));
    } else {
      setCalculateQuarterSprint(calculateQuarterData(quarters));
    }
  }, [cadenceType]);

  return (
    <>
      <Row gutter={[24, 4]}>
        <Col span={13}>
          <SprintAllocationWidget
            quarterSprintData={quarters}
            sprints={currentHalfSprints}
            cadenceType={cadenceType} />
        </Col>
        <Col span={11}>
          <TeamBulletin />
        </Col>
      </Row>
      <Row gutter={[16, 4]}>
        {isCadenceType
          ? (
            <Col span={14}>
              <JiraPendingWorkWidget />
            </Col>
          )
          : null}
        <Col span={isCadenceType ? 10 : 24}>
          <Row gutter={[16, 4]}>
            <Col span={isCadenceType ? 24 : 12}>
              <MyRisksStats type={isCadenceType} />
            </Col>
            <Col span={isCadenceType ? 24 : 12}>
              <Card
                className="sprint-card"
                heading={isCadenceType ? t('component.general.user.project.sprint.time.title') : t('component.general.user.project.sprint.days.title')}
                showBorder>
                {((spentHours > 0 || remainingHours > 0)
                || (spentDays > 0 || remainingDays > 0)) ? (
                  <>
                    <div className="d-flex justify-content-center align-item-center">
                      <span className="sprint-text">
                        {isCadenceType && lastDayMessage}
                      </span>
                    </div>
                    <DonutChartWidget
                      series={
                        isCadenceType ? [spentHours,
                          remainingHours]
                          : [spentDays, remainingDays]
}
                      labels={isCadenceType ? labels
                        : quarterSprintLabels}
                      name={t('component.user.dashboard.label.users')}
                      height={150}
                      customOptions={{
                        colors: [COLORS[11], COLORS[10]],
                        legend: {
                          show: true,
                          position: 'right',
                          offsetY: 50,
                          offsetX: 5
                        },
                        plotOptions: {
                          pie: {
                            donut: {
                              size: '55%'
                            }
                          }
                        }
                      }} />
                  </>
                  ) : (
                    <Empty />
                  )}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>

  );
};

export default MyProjectStatus;
