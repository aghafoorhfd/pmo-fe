import {
  Button,
  Col, Progress, Row, Empty, notification, Form, Typography,
  DatePicker, Modal as AntModal, Skeleton, Switch
} from 'antd';
import { Gantt, ViewMode } from 'gantt-task-react';
import { projectTimelineHeaders } from 'mock/data/projectManager';
import { useEffect, useState } from 'react';
import 'gantt-task-react/dist/index.css';
import { useTranslation } from 'react-i18next';
import ProjectService from 'services/ProjectService';
import { ProjectStageMapping } from 'constants/ProjectMapping';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
import Modal from 'components/shared-components/Modal/index';
import { PROJECT_METRICS, PROJECT_TIMELINES_METRICS, DEPENDENCY_TYPE } from 'constants/MiscConstant';
import { resetStageToEdit, setSelectedProjectDetails } from 'store/slices/projectDetailsSlice';
import {
  calculateSortedMilestones,
  formatSubStageDates,
  getColumnWidth,
  getDateRanges, getRangeActions, mergeSubStagesIntoStages, parseMilestones, parseTimelineRanges,
  capitalize
} from 'utils/utils';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_YYYY_MM_DD, DATE_FORMAT_MM_YYYY } from 'constants/DateConstant';
import { ROLES } from 'constants/RolesConstant';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'components/shared-components/Loading';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { noop } from 'lodash';
import ToolTip from 'components/shared-components/Tooltip';
import ProjectStatisticWidget from '../ProjectStatisticsWidget';
import ProjectTimelineForm from '../ProjectTimelineForm';
import ProjectMilestoneModal from '../ProjectMilestoneModal';
import '../ProjectManagerDashboard.css';
import TooltipContent from './SubStageToolTip';

const { confirm } = AntModal;
const { Text } = Typography;

const {
  STAGES, DEPENDENCY, MILESTONES, SUB_STAGES, SUB_STAGES_DEPENDENCY
} = PROJECT_TIMELINES_METRICS;
const { RangePicker } = DatePicker;

const ProjectManagerTimelines = () => {
  const [checkForms, setCheckForm] = useState(false);
  const [metricsModalVisibility, setMetricsModalVisibility] = useState(false);
  const [metricsType, setMetricsType] = useState('');
  const [milestoneToUpdate, setMilestoneToUpdate] = useState(null);
  const [dateRanges, setDateRanges] = useState([]);
  const [projectRange, setProjectRange] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [projectMilestones, setProjectMilestones] = useState([]);
  const [projectProgress, setProjectProgress] = useState(0);
  const [viewDate, setViewDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subStagesFormVisibility, setSubStagesFormVisibility] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isTimelineLock, setIsTimelineLock] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    auth: { user, userProfile: { userName } },
    projectDetails: {
      selectedProjectDetails: {
        createdBy: projectCreatedBy,
        projectManager,
        projectCadence,
        id: pID
      },
      stageToEdit: {
        subStages,
        stageDetails
      }
    }
  } = useSelector(({ projectDetails, auth }) => ({
    auth,
    projectDetails
  }));

  const [form] = Form.useForm();

  const projectId = searchParams.get('projectId');
  const actionBtnDisability = (user === ROLES.PROJECT_MANAGER
    && projectCreatedBy && !([projectManager, projectCreatedBy].includes(userName)));

  const getProjectTimeLines = async (customRanges) => {
    try {
      setIsLoading(true);
      const timelineResponse = await ProjectService.getProjectTimeLine(pID);
      const { data: { milestones = [], stages = [], progress } = {} } = timelineResponse;
      if (stages.length) {
        const ranges = customRanges || getDateRanges(stages, projectCadence);
        const queryString = `fromDate=${ranges[0].format(DATE_FORMAT_YYYY_MM_DD)}&toDate=${ranges[1].format(DATE_FORMAT_YYYY_MM_DD)}`;
        const rangeAction = getRangeActions(projectCadence);
        const rangeResponse = await rangeAction(queryString);

        const { data: { sprints = [], quarters = [] } = {} } = rangeResponse;

        const transformedTasks = mergeSubStagesIntoStages(ProjectStageMapping, stages);
        const transformedMilestones = parseMilestones(calculateSortedMilestones(milestones));
        const ganttChartRanges = projectCadence === methodologyType.AGILE_CAPS
          ? sprints : quarters;
        const transformedRange = parseTimelineRanges(ganttChartRanges, projectCadence);
        setProjectTasks(transformedTasks);
        setProjectRange(transformedRange);
        setProjectMilestones(transformedMilestones);
        setProjectProgress(progress);

        if (!customRanges) {
          setDateRanges(ranges);
        }
      } else {
        setProjectRange([]);
        setProjectTasks([]);
        setProjectProgress(0);
      }
    } catch (err) {
      setDateRanges([]);
      setProjectTasks([]);
      const { message } = err;
      notification.error({ message });
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteStage = (deletedTask) => {
    const checkIsStageHasSubStage = projectTasks.filter(
      (barsData) => barsData.project === deletedTask.id
        && barsData.subStageName?.props?.title
    );
    const confirmationMessage = checkIsStageHasSubStage.length ? t('component.project.manager.timelines.deleteStage.with.subStage.confirmation') : t('component.project.manager.timelines.deleteStage');
    confirm({
      title: confirmationMessage,
      async onOk() {
        try {
          await ProjectService.deleteMetric(
            projectId,
            PROJECT_METRICS.STAGES,
            deletedTask?.stageName?.props.title
          );
          setProjectTasks(projectTasks.filter(
            (task) => deletedTask.id !== task.id
            && task.project !== deletedTask.id
          ));
          notification.success({ message: t('component.project.manager.timelines.deleteStage.success') });
        } catch (err) {
          noop();
        }
      },
      onCancel() { }
    });
  };

  useEffect(() => {
    if (pID === projectId) {
      getProjectTimeLines();
    }
  }, [pID, projectId]);

  useEffect(() => () => {
    setProjectRange([]);
    setProjectTasks([]);
    dispatch(setSelectedProjectDetails(''));
  }, []);

  useEffect(() => {
    const projectRangeKeys = Object.keys(projectRange);

    if (projectRangeKeys.length) {
      const dateToView = new Date(projectRange[projectRangeKeys[0]]?.startDate);
      setViewDate(dateToView);
    }
  }, [projectRange]);

  const handleModalVisibility = (type) => {
    setMetricsModalVisibility(true);
    setMetricsType(type);
  };

  const handleSubmit = async () => {
    try {
      const values = form.getFieldsValue(true);
      await form.validateFields();
      const { stageDateRange: [fromDate = '', toDate = ''] = [] } = values;
      const startDate = moment(fromDate || values?.startDate)
        .format(DATE_FORMAT_DD_MM_YYYY);
      const endDate = moment(toDate || values?.endDate)
        .format(DATE_FORMAT_DD_MM_YYYY);
      let payload;
      switch (metricsType) {
        case STAGES:
          payload = {
            metricName: values?.stage,
            startDate,
            endDate,
            outlook: values?.outlook?.hex || values?.outlook,
            subStages: formatSubStageDates(subStages)
          };

          await ProjectService.addStages(pID, payload);

          dispatch(resetStageToEdit());
          break;

        case SUB_STAGES:
          payload = {
            metricName: values?.stage,
            startDate,
            endDate,
            outlook: values?.outlook?.hex || values?.outlook,
            subStages: formatSubStageDates(subStages),
            metricStatus: values?.metricStatus,
            dependencies: values?.dependencies,
            metricType: values?.metricType
          };

          await ProjectService.updateStage(pID, {
            ...payload,
            metricStatus: values?.metricStatus,
            dependencies: values?.dependencies,
            metricType: values?.metricType
          });

          dispatch(resetStageToEdit());
          break;
        case MILESTONES:
          payload = {
            metricName: values?.milestone,
            startDate,
            endDate
          };
          await ProjectService.addMilestones(pID, payload);
          break;
        case DEPENDENCY: {
          const timelineResponse = await ProjectService.getProjectTimeLine(pID);
          const { data: { stages } = {} } = timelineResponse;
          const projectStage = stages?.find(({ stageName }) => stageName === values?.dependentOn);
          const prevDependencies = projectStage?.dependencies?.filter(
            ({ stageName }) => stageName !== values?.isDependent
          ) || [];

          payload = {
            projectStageName: values?.dependentOn,
            dependencies: [
              ...prevDependencies,
              {
                stageName: values?.isDependent,
                percentage: values?.percentage || 100,
                startDate,
                endDate
              }
            ]
          };
          await ProjectService.addDependency(pID, payload);
          break;
        }

        case SUB_STAGES_DEPENDENCY: {
          const timelineResponse = await ProjectService.getProjectTimeLine(pID);
          const { data: { stages } = {} } = timelineResponse;
          const projectStage = stages?.find(({ stageName }) => stageName === values?.stage);

          const projectSubStage = projectStage?.subStages.find(
            ({ subStageName }) => subStageName === values?.dependentOn
          );

          const prevDependencies = projectSubStage?.subStagesDependencies?.filter(
            ({ stageName }) => stageName !== values?.isDependent
          ) || [];

          payload = {
            projectStageName: projectStage?.stageName,
            projectSubStageName: values?.dependentOn,
            dependencies: [
              ...prevDependencies,
              {
                stageName: values?.isDependent,
                percentage: values?.percentage || 100,
                startDate,
                endDate
              }
            ]
          };

          await ProjectService.updateSubStage(projectId, payload);
          break;
        }
        default:
          break;
      }
      setMetricsModalVisibility(false);
      form.resetFields();
      notification.success({
        message: t(
          stageDetails.stage
            ? 'component.projectMetrics.updated.message'
            : 'component.project.metrics.success.message',
          {
            metricsType: t(`component.project.metrics.${metricsType}`)
          }
        )
      });
      getProjectTimeLines();
    } catch (err) {
      const { message } = err;
      notification.error({ message });
    }
  };

  const modalTitle = {
    milestones: 'addMilestone',
    dependency: 'addDependency',
    stages: 'addStageName',
    subStages: 'addSubStage',
    subStagesDependency: 'stage.addSubStages.dependency'
  };

  const onCancelHandler = () => {
    setMetricsModalVisibility(false);
    setSubStagesFormVisibility(false);
    setCheckForm(false);
  };

  const handleMilestoneClick = ({ title }) => {
    const milestone = projectMilestones.find(({ title: milestoneName }) => milestoneName === title);
    setMilestoneToUpdate(milestone);
  };

  const onCancelMilestoneModal = () => {
    setMilestoneToUpdate(null);
  };

  const onRangeChange = (value) => {
    if (value) {
      const startDate = value[0].startOf('month');
      const endDate = value[1].endOf('month');
      setDateRanges([startDate, endDate]);
      getProjectTimeLines([startDate, endDate]);
    }
  };

  const handleUpdateStage = async (project, tasks) => {
    try {
      const { data: latestStageDetails } = await ProjectService.getStageDetails(
        pID,
        project?.stageName?.props?.title || tasks?.stageName?.props?.title
      );
      let payload = {};

      if (project) {
        const changedProject = tasks.find(
          (newTask) => newTask.id === project.id
        );

        const changedTasks = tasks.filter(
          (newTask) => newTask.project === project.id
        );

        payload = {
          ...latestStageDetails,
          startDate: moment(changedProject.start).format(DATE_FORMAT_DD_MM_YYYY),
          endDate: moment(changedProject.end).format(DATE_FORMAT_DD_MM_YYYY),
          subStages: latestStageDetails.subStages.map((subStage, i) => ({
            ...subStage,
            startDate: moment(changedTasks[i].start).format(DATE_FORMAT_DD_MM_YYYY),
            endDate: moment(changedTasks[i].end).format(DATE_FORMAT_DD_MM_YYYY)
          }))
        };
      } else {
        payload = {
          ...latestStageDetails,
          startDate: moment(tasks.start).format(DATE_FORMAT_DD_MM_YYYY),
          endDate: moment(tasks.end).format(DATE_FORMAT_DD_MM_YYYY)
        };
      }

      await ProjectService.updateStage(pID, payload);
    } catch (err) {
      notification.error({
        message: t('component.project.manager.timelines.error')
      });
      getProjectTimeLines();
    }
  };

  const getStartEndDateForProject = (tasks, pId) => {
    const pTasks = tasks.filter((task) => task.project === pId);
    let { start } = pTasks[0];
    let { end } = pTasks[0];

    pTasks.forEach((task) => {
      if (start.getTime() > task.start.getTime()) {
        start = task.start;
      }
      if (end.getTime() < task.end.getTime()) {
        end = task.end;
      }
    });

    return [start, end];
  };

  const handleTaskChange = (task) => {
    let newTasks = projectTasks.map(
      (projectTask) => (
        projectTask.id === task.id ? task : projectTask
      )
    );
    let project;

    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      project = newTasks[newTasks.findIndex((newTask) => newTask.id === task.project)];
      if (
        project.start.getTime() !== start.getTime()
        || project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map(
          (newTask) => (
            newTask.id === task.project ? changedProject : newTask
          )
        );
      }
    }

    setProjectTasks(newTasks);
    handleUpdateStage(project, project ? newTasks : task);
  };

  const handleExpanderClick = (task) => {
    setProjectTasks(
      projectTasks.map(
        (projectTask) => (projectTask.id === task.id ? task : projectTask
        )
      )
    );
  };

  const onProjectChange = (pId) => {
    setSearchParams({ projectId: pId });
  };

  const getMetricTitle = (metric) => {
    const { props: { title } = {} } = metric;
    return title;
  };

  const removeDependencyConfirmation = (dependent, dependentOn) => {
    const { STAGE, SUB_STAGE } = DEPENDENCY_TYPE;
    const { project: substageBelongingStageName } = dependent;
    const metricType = substageBelongingStageName ? SUB_STAGE.key : STAGE.key;
    const confirmationMsg = t('component.project.manager.timelines.dependency.delete.warning', { metricType: DEPENDENCY_TYPE[metricType].value });
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h5>{t(confirmationMsg)}</h5>,
      async onOk() {
        try {
          const isMetricTypeStage = metricType === STAGE.key;
          const payload = {
            stageName: isMetricTypeStage ? getMetricTitle(dependentOn?.stageName)
              : substageBelongingStageName,
            dependentOn: getMetricTitle(isMetricTypeStage ? dependent?.stageName
              : dependent?.subStageName),
            dependencyType: metricType,
            ...(!isMetricTypeStage ? { subStageName: getMetricTitle(dependentOn?.subStageName) }
              : {})
          };
          await ProjectService.removeMetricDependency(pID, payload);
          notification.success({
            message: t(
              'component.project.manager.timelines.dependency.delete.successful',
              {
                metricsType: capitalize(DEPENDENCY_TYPE[metricType].value)
              }
            )
          });
          getProjectTimeLines();
        } catch (err) {
          const { message } = err;
          notification.error({ message });
        }
      }
    });
  };

  const handleDateRangeChange = (task, dates) => {
    const updatedTask = { ...task };
    if (dates) {
      const [start, end] = dates;
      updatedTask.start = start.toDate();
      updatedTask.end = end.toDate();
      handleTaskChange(updatedTask);
    }
  };

  return (
    <>
      <ProjectStatisticWidget
        fetchAllProjects
        projectId={projectId}
        isProjectSelectable
        onProjectSelection={onProjectChange}
        onLoadingFinish={setIsLoading} />
      <Row justify="space-between" className="border-top border-bottom py-3 mb-4 mt-5 project-timelines-heading">
        <Col className="d-flex align-items-center">
          <Text className="project-timeline-title">{t('component.project.manager.timeline')}</Text>
        </Col>
        <Col>

          <ToolTip
            icon={(
              <Button
                className="mr-3"
                onClick={() => handleModalVisibility(PROJECT_TIMELINES_METRICS.STAGES)}
                id="add-stage-btn"
                disabled={actionBtnDisability || isLoading || !pID}>
                {t('component.project.manager.timelines.addStageName')}
              </Button>
)}
            title={t('component.project.manager.timelines.addStageName.helperText')} />

          <ToolTip
            icon={(
              <Button
                className="mr-3"
                onClick={() => handleModalVisibility(PROJECT_TIMELINES_METRICS.SUB_STAGES)}
                id="add-sub-stage-btn"
                disabled={actionBtnDisability || isLoading || !pID || projectTasks.length < 1}>
                {t('component.project.manager.timelines.addSubStage')}
              </Button>
             )}
            title={t('component.project.manager.timelines.addSubStage.helperText')} />

          <Button
            className="mr-3"
            onClick={() => handleModalVisibility(PROJECT_TIMELINES_METRICS.DEPENDENCY)}
            id="add-dependency-btn"
            disabled={actionBtnDisability || isLoading || projectTasks.length < 1}>
            {t('component.project.manager.timelines.addDependency')}
          </Button>
          <Button
            className="mr-3"
            onClick={() => handleModalVisibility(PROJECT_TIMELINES_METRICS.SUB_STAGES_DEPENDENCY)}
            id="add-dependency-btn"
            disabled={actionBtnDisability || isLoading || projectTasks.length < 1}>
            {t('component.project.manager.timelines.addSubStageDependency')}
          </Button>
          <Button
            className="mr-3"
            type="primary"
            onClick={() => handleModalVisibility(PROJECT_TIMELINES_METRICS.MILESTONES)}
            id="add-milestone-btn"
            disabled={actionBtnDisability || isLoading || projectTasks.length === 0}>
            {t('component.project.manager.timelines.addMilestone')}
          </Button>
        </Col>
      </Row>
      {isLoading ? <Skeleton className="progess-bar-skeleton" active paragraph={{ rows: 1 }} title /> : <Progress percent={projectProgress} format={(percent) => `${percent}% Completed`} strokeWidth="20px" className="mb-4 timeline-progress-bar" />}

      {
        !isLoading ? (
          <>
            <Row align="middle">
              {
                (!actionBtnDisability && projectTasks?.length !== 0) && (
                <Col span={12}>
                  <Switch
                    checked={isTimelineLock}
                    checkedChildren={t('component.project.manager.timelines.unlock')}
                    unCheckedChildren={t('component.project.manager.timelines.lock')}
                    onChange={setIsTimelineLock} />
                </Col>
                )
              }
              <Col flex="auto" className="d-flex justify-content-end">
                <ToolTip
                  icon={(
                    <RangePicker
                      disabled={!pID}
                      id="project-timeline-range"
                      onChange={onRangeChange}
                      format={DATE_FORMAT_MM_YYYY}
                      value={dateRanges}
                      picker="month" />
            )}
                  title={t('component.project.manager.timelines.rangepicker.helperText')} />
              </Col>

            </Row>
            <div className="text-center gantt-chart-container mt-3">
              {!isLoading && projectTasks?.length
                ? (
                  <Gantt
                    tasks={projectTasks}
                    viewMode={ViewMode.Range}
                    columnWidth={getColumnWidth(projectCadence)}
                    handleWidth={5}
                    headerHeight={64}
                    listCellWidth="130px"
                    ranges={projectRange}
                    headers={[...projectTimelineHeaders(
                      onDeleteStage,
                      actionBtnDisability,
                      handleDateRangeChange,
                      projectRange,
                      isTimelineLock
                    )
                    ]}
                    onExpanderClick={handleExpanderClick}
                    milestones={projectMilestones}
                    onMilestoneClick={(milestone) => handleMilestoneClick(milestone)}
                    barFill={45}
                    todayColor="#fefefe"
                    viewDate={viewDate}
                    TooltipContent={TooltipContent}
                    {...(!actionBtnDisability && {
                      onArrowDoubleClick: removeDependencyConfirmation,
                      ...(!isTimelineLock && { onDateChange: handleTaskChange })
                    })} />
                ) : <Empty className="m-2" />}
            </div>
          </>
        ) : (
          <div className="my-4">
            <Loading />
          </div>
        )
      }
      {
        metricsModalVisibility && (
          <Modal
            forceRender
            title={t(`component.project.manager.timelines.${modalTitle[metricsType]}`)}
            confirmOnCancel={checkForms}
            open={metricsModalVisibility}
            onCancel={onCancelHandler}
            customWidth={[STAGES, SUB_STAGES].includes(metricsType) ? 650 : 408}
            customHeight={[STAGES, SUB_STAGES].includes(metricsType) ? 600 : 'auto'}
            bodyStyle={[STAGES, SUB_STAGES].includes(metricsType) ? { overflowY: 'scroll', maxHeight: 'calc(100vh - 200px)' } : {}}
            okText={t('component.common.save.label')}
            onOk={form.submit}
            okButtonProps={{
              disabled: subStagesFormVisibility
            }}>
            <ProjectTimelineForm
              form={form}
              formToShow={metricsType}
              handleSubmit={handleSubmit}
              setCheckForm={setCheckForm}
              milestones={projectMilestones}
              projectTasks={projectTasks}
              projectId={projectId}
              subStagesFormVisibility={subStagesFormVisibility}
              setSubStagesFormVisibility={setSubStagesFormVisibility} />
          </Modal>
        )
      }
      {
        milestoneToUpdate && (
          <ProjectMilestoneModal
            disabled={actionBtnDisability}
            milestone={milestoneToUpdate}
            onCancel={onCancelMilestoneModal}
            projectId={projectId}
            onSuccess={getProjectTimeLines} />
        )
      }
    </>
  );
};

export default ProjectManagerTimelines;
