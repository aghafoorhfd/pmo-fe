import React from 'react';
import './index.css';
import { Timeline, Typography } from 'antd';
import { DATE_FORMAT_DD_MM_YYYY_WITH_SLASH, DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const { Paragraph } = Typography;

const TooltipContent = ({ task } = {}) => {
  const { t } = useTranslation();

  const {
    start, end, stageName = {}, subStageName = {},
    originalDependencies = [], isProjectTimeline
  } = task || {};
  const { props: { title: subStageTitle } = {} } = subStageName;
  const { props: { title: stageTitle } = {} } = stageName;
  return (
    <div className={`sub-stage-tooltip-container ${isProjectTimeline !== undefined && isProjectTimeline ? 'project-tooltip-position' : ''}`}>
      {
        originalDependencies.length > 0 && (
          <Paragraph strong>
            {`${t('component.project.manager.timelines.dependency.dependents')}:`}
          </Paragraph>
        )
      }
      <Timeline className="sub-stage-tooltip">
        {originalDependencies.map(({
          stageName: dependentStageName, startDate, endDate
        }) => (
          <Timeline.Item key={dependentStageName}>
            {`${dependentStageName}: ${moment(startDate, DATE_FORMAT_DD_MM_YYYY_WITH_SLASH).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH)} - ${moment(endDate, DATE_FORMAT_DD_MM_YYYY_WITH_SLASH).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH)}`}
          </Timeline.Item>
        ))}
      </Timeline>
      <Paragraph>
        {`${(stageTitle || subStageTitle || stageName)}: ${moment(start).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH)} - ${moment(end).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH)}`}
      </Paragraph>
    </div>
  );
};

export default TooltipContent;
