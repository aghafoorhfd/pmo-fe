import React from 'react';
import {
  Col, Tag, Typography
} from 'antd';
import './index.css';

const JiraTableItems = ({
  jiraIssues,
  maxItemsInSprint,
  colSpan
}) => {
  const { Link } = Typography;
  return Object.keys(jiraIssues).map((sprintName) => {
    const sprint = jiraIssues[sprintName];
    const sprintItems = sprint.projectIssues;
    const emptyItemCount = maxItemsInSprint - sprintItems.length;
    return (
      <Col span={colSpan} className="text-center p-0" key={sprintName}>
        {sprintItems.map((jiraItems) => (
          <Col span={24} className={`${sprint.currentSprint ? 'active-sprint' : ''} sprint-container text-center p-2`} key={jiraItems.ticketKey}>
            <Link href={jiraItems.ticketUrl} underline>{jiraItems.ticketKey}</Link>
            <div className="status-text mt-1">{jiraItems.assignee}</div>
            <div className="mt-1">
              {jiraItems.status && (
              <Tag className="rounded-tag text-center status-text" color={jiraItems.statusColor}>
                {jiraItems.status}
              </Tag>
              )}
            </div>
          </Col>
        ))}
        {[...Array(emptyItemCount)].map((_, index) => (
          <Col span={24} className="sprint-container text-center p-2" key={`${sprintName}-${index + 1}`} />
        ))}
      </Col>
    );
  });
};
export default JiraTableItems;
