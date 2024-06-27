import {
  Col, Empty, notification, Row, Skeleton
} from 'antd';
import { JiraMapping, jiraTimelineHeaders } from 'constants/JiraMapping';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ProjectService from 'services/ProjectService';
import { DATE_FORMAT_YYYY_MM_DD } from 'constants/DateConstant';
import {
  getColumnWidth,
  getDateRanges, getRangeActions, mergeSubStagesIntoStages, parseJiraIssues, parseTimelineRanges
} from 'utils/utils';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import { hideMessage, resetJiraStore, resetCallbackStatus } from 'store/slices/jiraSlice';
import { STATUS } from 'constants/StatusConstant';
import { getJiraBacklog, getJiraIssueMap, getJiraStories } from 'utils/jiraUtils';
import { setSelectedProjectDetails } from 'store/slices/projectDetailsSlice';
import Loading from 'components/shared-components/Loading';
import { useSearchParams } from 'react-router-dom';
import { noop } from 'lodash';
import ProjectStatisticWidget from '../ProjectStatisticsWidget';
import AddJiraItemForm from './AddJiraItemForm';
import ImpactedEpics from './ImpactedEpics';
import JiraUserStoriesWidget from './jira-widgets/JiraUserStoriesWidget';
import WorkProgressWidget from './jira-widgets/WorkProgressWidget';
import TooltipContent from './JiraTooltip';
import '../ProjectManagerDashboard.css';
import './index.css';
import JiraDrawer from './JiraDrawer';
import JiraTimelineTable from './JiraTimelineTable';

const initialJiraChartData = {
  tasks: [],
  ranges: []
};

const JiraTimeline = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isFormVisible, setFormVisibility] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedTaskStories, setSelectedTaskStories] = useState(null);

  const [jiraChartData, setJiraChartData] = useState(initialJiraChartData);

  const [jiraSyncLoader, setJiraSyncLoader] = useState(false);
  const [jiraLinkLoader, setJiraLinkLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [jiraIssuesLoader, setJiraIssuesLoader] = useState(true);
  const [jiraIssues, setJiraIssues] = useState({});
  const { SUCCESS } = STATUS;

  const {
    jira: {
      message, showMessage, status, callbackStatus
    },
    projectDetails: {
      selectedProjectDetails:
      {
        projectKey, projectCadence, id: pID
      } = {}
    } = {}
  } = useSelector(({ jira, projectDetails }) => ({ jira, projectDetails }));
  const projectId = searchParams.get('projectId');

  const getProjectTimeLines = async (customRanges) => {
    try {
      setIsLoading(true);
      const timelineResponse = await ProjectService.getProjectTimeLine(pID);
      const { data: { stages = [] } = {} } = timelineResponse;
      if (stages.length) {
        const ranges = customRanges || getDateRanges(stages);
        const rangeAction = getRangeActions(projectCadence);
        const rangeResponse = await rangeAction(
          `fromDate=${ranges[0].format(DATE_FORMAT_YYYY_MM_DD)}&toDate=${ranges[1].format(DATE_FORMAT_YYYY_MM_DD)}`
        );
        const { data: { sprints = [], quarters = [] } = {} } = rangeResponse;
        const ganttChartRanges = projectCadence === methodologyType.AGILE_CAPS
          ? sprints : quarters;
        const transformedTasks = mergeSubStagesIntoStages(JiraMapping, stages);
        const transformedRange = parseTimelineRanges(ganttChartRanges, projectCadence);
        setJiraChartData({
          tasks: transformedTasks,
          ranges: transformedRange
        });
      } else {
        setJiraChartData(initialJiraChartData);
      }
    } catch (err) {
      const { message: errMessage } = err;
      notification.error({ message: errMessage });
      setJiraChartData(initialJiraChartData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchJiraIssues = async () => {
    try {
      if (projectKey) {
        setJiraIssuesLoader(true);
        const { data } = await ProjectService.getJiraIssues(pID, projectKey);
        if (Object.keys(data)?.length > 0) {
          const jiraData = parseJiraIssues(data);
          setJiraIssues(jiraData);
        }
      }
    } catch (err) {
      if (Object.keys(jiraIssues)?.length > 0) {
        setJiraIssues({});
      }
      notification.error({ message: err.message });
    } finally {
      setJiraIssuesLoader(false);
    }
  };

  useEffect(() => {
    if (pID === projectId) {
      getProjectTimeLines();
      handleFetchJiraIssues();
    }
  }, [pID, projectId]);

  useEffect(() => {
    if (showMessage) {
      notification[status]({ message });
      dispatch(hideMessage());
      if (status === SUCCESS && message === t('component.jira.add.item.success')) {
        getProjectTimeLines();
      }
    }
  }, [showMessage]);

  const handleFormVisibility = (visibility) => {
    setFormVisibility(visibility);
  };
  // For client instruction remove add jira work item for now
  // const handleAddWorkItem = () => {
  //   handleFormVisibility(true);
  // };

  const handleJiraLinkAccount = async () => {
    try {
      const { data: { authUrl } } = await ProjectService.jiraLinkAccount(projectId);
      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch {
      noop();
    }
  };

  const handleJiraDataSync = async () => {
    try {
      if (projectKey) {
        setJiraSyncLoader(true);
        await ProjectService.syncJira(pID, projectKey);
        notification.success({ message: t('component.jira.sync.success') });
        const { data: details } = await ProjectService.getProjectDetails(pID);
        if (details) {
          dispatch(setSelectedProjectDetails({ ...details, id: pID }));
        }
      } else {
        notification.error({ message: t('component.jira.projectKeyNotFound.error') });
      }
    } catch (err) {
      notification.error({ message: err.message });
    } finally {
      setJiraSyncLoader(false);
    }
  };

  const handleJiraLink = () => {
    if (projectKey) {
      setJiraLinkLoader(true);
      handleJiraLinkAccount();
    } else {
      setJiraLinkLoader(false);
      notification.error({ message: t('component.jira.projectKeyNotFound.error') });
    }
  };
  const timelineClickHandler = (task, isBlacklog) => {
    let jiraIssuesMap = getJiraIssueMap(task?.jiraIssues || []);
    if (isBlacklog) {
      jiraIssuesMap = getJiraBacklog(jiraIssuesMap);
    } else {
      jiraIssuesMap = getJiraStories(jiraIssuesMap);
    }
    setSelectedTaskStories(jiraIssuesMap);
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => { setDrawerOpen(false); };

  const handleExpanderClick = (task) => {
    setJiraChartData({
      ...jiraChartData,
      tasks: jiraChartData.tasks.map(
        (projectTask) => (projectTask.id === task.id ? task : projectTask
        )
      )
    });
  };

  useEffect(() => {
    if (typeof callbackStatus === 'boolean' && projectKey) {
      if (callbackStatus) {
        handleJiraDataSync();
      }
      dispatch(resetCallbackStatus());
    }
  }, [callbackStatus, projectKey]);

  useEffect(() => () => {
    dispatch(setSelectedProjectDetails(''));
    setJiraChartData(initialJiraChartData);
    return () => {
      dispatch(resetJiraStore());
    };
  }, []);

  const onProjectChange = (pId) => {
    setSearchParams({ projectId: pId });
  };

  const handleLoader = (loading) => {
    setIsLoading(loading);
    setJiraIssuesLoader(loading);
  };

  return (

    <>
      <ProjectStatisticWidget
        projectId={projectId}
        isProjectSelectable
        onProjectSelection={onProjectChange}
        onLoadingFinish={handleLoader} />
      <Row gutter={16}>
        <Col xs={24} md={24} lg={12} xl={12}>
          <WorkProgressWidget projectId={pID} />
        </Col>
        <Col xs={24} md={24} lg={12} xl={12}>
          <JiraUserStoriesWidget />
        </Col>
      </Row>
      <ImpactedEpics
        jiraSyncLoader={jiraSyncLoader}
        jiraLinkLoader={jiraLinkLoader}
        // addWorkItem={handleAddWorkItem}
        onJiraSync={handleJiraDataSync}
        onJiraLink={handleJiraLink} />
      {!jiraIssuesLoader && Object.keys(jiraIssues ?? {}).length > 0 && (
      <JiraTimelineTable
        jiraIssues={jiraIssues} />
      )}
      {
        jiraIssuesLoader && (
          <Skeleton active />
        )
      }
      {
        !isLoading && jiraChartData?.tasks?.length > 0 && (
          <div className="mt-4">
            <Gantt
              TooltipContent={TooltipContent}
              tasks={jiraChartData?.tasks}
              viewMode={ViewMode.Range}
              columnWidth={getColumnWidth(projectCadence)}
              headerHeight={64}
              listCellWidth="140px"
              barBackgroundColor="rgba(164,97,216,1)"
              projectBackgroundColor="rgba(255,107,114,1)"
              ranges={jiraChartData?.ranges}
              headers={jiraTimelineHeaders(timelineClickHandler)}
              onClick={timelineClickHandler}
              barFill={45}
              onExpanderClick={handleExpanderClick} />
          </div>
        )
      }

      {
        !isLoading && jiraChartData?.tasks?.length <= 0 && (
          <div className="mt-4"><Empty /></div>
        )
      }

      {
        isLoading && (
          <div className="my-4">
            <Loading />
          </div>
        )
      }

      {isFormVisible && (
        <AddJiraItemForm
          tasks={jiraChartData?.tasks}
          isFormVisible={isFormVisible}
          setFormVisibility={handleFormVisibility}
          projectId={pID} />
      )}
      {isDrawerOpen && (
        <JiraDrawer
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          jiraIssues={selectedTaskStories} />
      )}
      {
        jiraSyncLoader && <Loading entire="entire" tip={t('component.jira.sync.loading.message')} />
      }
    </>
  );
};

export default JiraTimeline;
