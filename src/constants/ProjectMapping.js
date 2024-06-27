import moment from 'moment';
import { t } from 'i18next';
import { Tooltip, Typography } from 'antd';
import { setStagesDependencies } from 'utils/utils';
import { DATE_FORMAT_DD_MM_YYYY } from './DateConstant';

const { Paragraph } = Typography;
export const ProjectMapping = {
  start: ({ startDate }) => (startDate ? moment(startDate, DATE_FORMAT_DD_MM_YYYY).startOf('day').toDate()
    : moment().toDate()),
  end: ({ endDate }) => (endDate ? moment(endDate, DATE_FORMAT_DD_MM_YYYY).endOf('day').toDate()
    : moment().toDate()),
  stageName: 'projectName',
  id: 'projectId',
  type: 'task',
  hideChildren: false,
  displayOrder: 1,
  theme: 'theme',
  projectId: 'projectId',
  projectName: ({ projectName }) => (
    <Tooltip className="gantt-chart-stage" title={projectName}>
      <Paragraph ellipsis>
        {projectName}
      </Paragraph>
    </Tooltip>
  ),
  outlook: ({ outlook, outlookCode }) => (
    <span style={{
      backgroundColor: outlookCode,
      color: '#fefefe',
      borderRadius: '15px',
      padding: '6px 16px'
    }}>
      {outlook}
    </span>
  ),
  department: 'department',
  stage: 'stage',
  status: 'status',
  priority: 'priority',
  category: 'category',
  barBackgroundColor: '#ffbb54',
  nextMilestone: ({ nextMilestone = {} }) => {
    const { name, completionDate } = nextMilestone;
    return (
      <>
        <div>
          {name}
        </div>
        <div>{completionDate}</div>
      </>
    );
  },
  styles: {
    backgroundColor: (data) => data.outlookCode
  },
  hide: ({ startDate, endDate }) => !(startDate && endDate)
};

export const ProjectStageMapping = {
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
      <Tooltip className="gantt-chart-stage " title={subStageName}>
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
    originalDependencies: ({ dependencies, subStagesDependencies }) => (
      dependencies || subStagesDependencies || []
    ),
    jiraEpic: 'jiraEpic',
    barBackgroundColor: '#ffbb54',
    project: ({ projectName }) => projectName || null,
    styles: {
      backgroundColor: (data) => data.outlook
    },
    barText: (data) => {
      if (data.isResourceStageName) {
        return t('component.project.manager.resources.chart.numberOfResource', { count: data?.subStages?.length });
      }
      if (data.isResourceSubStage) {
        return `${data.capacity}% ${data.subStageName}`;
      }
      const { subStages = {} } = data || {};
      const subStagesToShow = Object.values(subStages);
      return subStagesToShow?.length ? t('component.project.manager.timelines.numberOfSubStages', { count: subStagesToShow?.length }) : null;
    },
    isProjectTimeline: ({
      isResourceStageName,
      isResourceSubStage
    }) => !(isResourceStageName || isResourceSubStage)
  },
  default: {
    stageName: '',
    action: null,
    subStageName: '',
    team: '',
    dependencies: [],
    jiraEpic: '',
    theme: ''
  }
};
export const generalUserProjectMapping = {
  allConflicts: 'allConflicts',
  taggedConflicts: 'taggedConflicts'
};
