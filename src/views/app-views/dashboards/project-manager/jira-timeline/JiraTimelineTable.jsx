import React from 'react';
import {
  Row, Col
} from 'antd';
import moment from 'moment';
import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';
import './index.css';
import JiraTableItems from './JiraTableItems';

const JiraTimelineTable = ({ jiraIssues }) => {
  const getSprintsDateRange = (sprintStartDate, sprintEndDate) => {
    if (sprintStartDate && sprintEndDate) {
      return `${moment(sprintStartDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH)} - ${moment(sprintEndDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH)}`;
    }
    return '';
  };

  const maxItemsInSprint = Math.max(...Object.values(jiraIssues).map(
    (sprint) => sprint.projectIssues.length
  ));

  const numItems = Object.keys(jiraIssues).length;
  const colSpanLookup = {
    1: 24,
    2: 12,
    default: 8
  };

  const colSpan = colSpanLookup[numItems] || colSpanLookup.default;

  return (
    <div className="overflow-auto h-50">
      <Row className="flex-nowrap fixed-top-header">
        {Object.keys(jiraIssues).map((sprintName) => {
          const issues = jiraIssues[sprintName];
          const { sprintStartDate, sprintEndDate } = jiraIssues[sprintName];
          const dateRange = getSprintsDateRange(sprintStartDate, sprintEndDate);
          return (
            <Col span={colSpan} className={`fixed-top-header ${issues.currentSprint ? 'active-sprint' : ''} sprint-header text-center p-4`} key={sprintName}>
              <strong>{sprintName}</strong>
              {dateRange && <div className="font-weight-light">{dateRange}</div>}
            </Col>
          );
        })}
      </Row>
      <Row className="jira-issues-container flex-nowrap">
        <JiraTableItems
          maxItemsInSprint={maxItemsInSprint}
          jiraIssues={jiraIssues}
          colSpan={colSpan} />
      </Row>
    </div>
  );
};

export default JiraTimelineTable;
