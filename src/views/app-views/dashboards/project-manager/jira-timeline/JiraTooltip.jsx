import React from 'react';
import { getJiraBacklog, getJiraStories } from 'utils/jiraUtils';
import './index.css';
import PropTypes from 'prop-types';

const TooltipContent = ({ task, showBacklogOnly = false } = {}) => {
  const { jiraIssues = [] } = task || {};
  let jiraIssuesMap = Object.keys(jiraIssues).map((key) => (
    { issueKey: key, ...jiraIssues[key] })) || [];

  if (showBacklogOnly) {
    jiraIssuesMap = getJiraBacklog(jiraIssuesMap);
  } else {
    jiraIssuesMap = getJiraStories(jiraIssuesMap);
  }

  if (jiraIssuesMap.length <= 0) {
    return null;
  }
  return (
    <div className="tool-tip-container">
      {jiraIssuesMap.map((issue) => (
        <div className="jira-item" key={issue?.issueKey}>
          <span className="font-weight-semibold jira-item-key">{issue?.issueKey}</span>
          {issue?.title && <span className="jira-item-name">{` - ${issue?.title}`}</span>}
        </div>
      ))}
    </div>
  );
};
TooltipContent.propTypes = {
  task: PropTypes.arrayOf(PropTypes.shape(
    {
      issueKey: PropTypes.string.isRequired,
      title: PropTypes.string
    }
  )).isRequired,
  showBacklogOnly: PropTypes.bool
};
TooltipContent.defaultProps = {
  showBacklogOnly: false
};
export default TooltipContent;
