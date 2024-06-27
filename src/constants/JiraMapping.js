import { Tooltip, Typography } from 'antd';
import moment from 'moment';
import { getJiraBacklog, getJiraIssueMap, getJiraStories } from 'utils/jiraUtils';
import TooltipContent from 'views/app-views/dashboards/project-manager/jira-timeline/JiraTooltip';
import { t } from 'i18next';
import { setStagesDependencies } from 'utils/utils';
import { DATE_FORMAT_DD_MM_YYYY } from './DateConstant';

const { Paragraph } = Typography;

export const JiraMapping = {
  mapping: {
    start: (data) => moment(data.startDate, DATE_FORMAT_DD_MM_YYYY).startOf('day').toDate(),
    end: (data) => moment(data.endDate, DATE_FORMAT_DD_MM_YYYY).endOf('day').toDate(),
    id: ({ stageName, subStageName, projectName }) => stageName || (`${projectName}-${subStageName}`),
    theme: 'theme',
    stageName: ({ stageName }) => (
      <Tooltip className="gantt-chart-stage" title={stageName}>
        <Paragraph ellipsis>
          {stageName}
        </Paragraph>
      </Tooltip>
    ),
    subStageName: ({ subStageName }) => (
      <Tooltip className="gantt-chart-stage" title={subStageName}>
        <Paragraph className="cursor-pointer" ellipsis>
          {subStageName}
        </Paragraph>
      </Tooltip>
    ),
    hideChildren: true,
    team: 'team',
    type: ({ subStages }) => (subStages?.length ? 'project' : 'task'),
    dependencies: ({
      dependencies,
      subStagesDependencies,
      projectName
    }) => setStagesDependencies(dependencies, subStagesDependencies, projectName),
    jiraEpic: 'jiraEpic',
    barBackgroundColor: '#ffbb54',
    project: ({ projectName }) => projectName || null,
    styles: {
      backgroundColor: (data) => data.outlook
    },
    jiraIssues: 'jiraIssues',
    barText: (data) => {
      const { jiraIssues = {} } = data || {};
      const jiraStories = getJiraStories(Object.values(jiraIssues));
      return jiraStories?.length ? t('component.jira.chart.numberOfIssues', { count: jiraStories?.length }) : null;
    }
  },
  default: {
    stageName: '',
    subStageName: '',
    team: '',
    dependencies: [],
    jiraEpic: '',
    theme: '',
    jiraIssues: []
  }
};

export const jiraTimelineHeaders = (handleBacklogClick) => [
  { key: 'stageName', title: t('component.jira.chart.column.stageName') },
  { key: 'subStageName', title: t('component.jira.chart.column.subStageName') },
  { key: 'team', title: t('component.jira.chart.column.team') },
  { key: 'jiraEpic', title: t('component.jira.chart.column.jiraEpic') },
  {
    title: t('component.jira.chart.column.backlog'),
    render: (task) => {
      const { jiraIssues = {} } = task || {};
      const jiraIssuesMap = getJiraIssueMap(jiraIssues);
      const backlog = getJiraBacklog(jiraIssuesMap);
      return (
        <div
          className="jira-backlog-column">
          <Tooltip
            title={TooltipContent({ task, showBacklogOnly: true })}
            placement="right"
            overlayClassName="jira-overlay-tooltip"
            showArrow={false}>
            <span
              role="button"
              tabIndex={0}
              onClick={() => handleBacklogClick(task, true)}>
              {backlog.length ? t('component.jira.chart.numberOfIssues', { count: backlog?.length }) : null}

            </span>
          </Tooltip>
        </div>
      );
    }
  }
];
