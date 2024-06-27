const JIRA_STATUS = {
  BACKLOG: 'Backlog',
  TODO: 'To Do',
  INPROGRESS: 'In Progress',
  DONE: 'Done'

};

export const getJiraIssueMap = (jiraIssues = {}) => Object.keys(jiraIssues).map((key) => (
  { issueKey: key, ...jiraIssues[key] })) || [];

export const getJiraStories = (jiraIssues = []) => (
  jiraIssues?.filter((issue) => !(issue?.status === JIRA_STATUS.BACKLOG
        || (issue?.status === JIRA_STATUS.TODO && issue?.assignedToSprints?.length <= 0))));

export const getJiraBacklog = (jiraIssues = []) => (
  jiraIssues?.filter((issue) => (
    [JIRA_STATUS.BACKLOG, JIRA_STATUS.INPROGRESS, JIRA_STATUS.DONE].includes(issue?.status)
            || (issue?.status === JIRA_STATUS.TODO && issue?.assignedToSprints?.length <= 0)
  ))
);
