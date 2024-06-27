import 'views/app-views/dashboards/project-manager/jira-timeline/index.css';
import 'views/app-views/dashboards/project-manager/project-timelines/index.css';
import { DeleteOutlined } from '@ant-design/icons';
import {

  DatePicker
} from 'antd';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import moment from 'moment';
import i18n from 'i18next';
import { PROJECT_TIMELINE_TYPE } from 'constants/MiscConstant';

const { t } = i18n;

const { RangePicker } = DatePicker;

const currentDate = new Date();

export const tasksMockData = [
  {
    // Task
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 26),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      28,
      12,
      28
    ),
    id: 'Task 0',
    type: 'task',
    theme: 'asdasdas',
    stageName: 'Task',
    subStageName: 'Sub Stage Name',
    team: 'Boxers',
    jiraEpic: 'MCI-241'
  },
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
    stageName: 'Research',
    subStageName: 'Sub Stage Name',
    id: 'Task 1',
    dependencies: ['Task 0'],
    type: 'task',
    project: 'ProjectSample',
    team: 'Boxers',
    jiraEpic: 'MCI-241'
  },
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 7, 0, 0),
    stageName: 'Research',
    subStageName: 'Sub Stage Name',
    id: 'Task 2',
    dependencies: ['Task 0'],
    type: 'task',
    project: 'ProjectSample',
    team: 'Boxers',
    jiraEpic: 'MCI-241'
  },
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
    stageName: 'Research',
    subStageName: 'Sub Stage Name',
    id: 'Task 3',
    dependencies: ['Task 0'],
    type: 'task',
    project: 'ProjectSample',
    team: 'Boxers'
    // jiraEpic:
  }
];
export const ranges = {
  1: {
    startDate: '1/01/2023',
    endDate: '01/15/2023'
  },
  2: {
    startDate: '01/16/2023',
    endDate: '01/30/2023'
  },
  3: {
    startDate: '01/31/2023',
    endDate: '02/10/2023'
  },
  4: {
    startDate: '02/11/2023',
    endDate: '02/20/2023'
  }
};

export const headers = [
  { key: 'projectName', title: 'Project Name' },
  { key: 'outlook', title: 'Outlook', bullet: true },
  { key: 'priority', title: 'Priority' },
  { key: 'stage', title: 'Stage' },
  { key: 'status', title: 'Status' },
  { key: 'theme', title: 'Theme' },
  { key: 'category', title: 'Category' }];

export const projectTimelineHeaders = (
  handleRemoveStage,
  actionBtnDisability,
  handleDateRangeChange,
  projectRange,
  isTimelineLock
) => [
  { key: 'stageName', title: 'Stage Name' },
  ...!actionBtnDisability ? [{
    key: 'action',
    title: 'Action',
    render: (task) => {
      const { project, index } = task;
      return (
        <div key={index} className="jira-backlog-column">
          <DeleteOutlined className={`${!project ? 'visible remove-action-btn' : 'invisible'}`} onClick={() => handleRemoveStage(task)} />
        </div>
      );
    }
  }] : [],

  { key: 'subStageName', title: 'Substage' },
  {
    key: 'range',
    title: <div className="date-range-timeline-header">{t('component.project.manager.timelines.dateRange')}</div>,
    render: (task) => {
      const { start, end, type } = task;
      const sprintDates = Object.values(projectRange);
      const earliestStartDate = moment(sprintDates[0].startDate, DATE_FORMAT_MM_DD_YYYY);
      const latestEndDate = moment(
        sprintDates[sprintDates.length - 1].endDate,
        DATE_FORMAT_MM_DD_YYYY
      );
      return (
        <div className="pr-2 date-range-timeline">
          <RangePicker
            disabled={type === PROJECT_TIMELINE_TYPE.project
              || actionBtnDisability || isTimelineLock}
            onChange={(dates) => handleDateRangeChange(task, dates)}
            format={DATE_FORMAT_MM_DD_YYYY}
            value={[moment(start), moment(end)]}
            disabledDate={(current) => current
            && (current < earliestStartDate || current > latestEndDate)} />
        </div>

      );
    }
  }
];

export const conflictsChartLabels = ['Open', 'Cancelled', 'Resolved'];
export const resourceCommitmentChartLabels = ['Requested', 'Assigned', 'Committed', 'Designated'];
