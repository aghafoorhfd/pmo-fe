import {
  Empty,
  notification, Switch, Row, Button, Col, DatePicker
} from 'antd';
import { Gantt, ViewMode } from 'gantt-task-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'gantt-task-react/dist/index.css';
import './ProjectManagerDashboard.css';
import { headers, tasksMockData } from 'mock/data/projectManager';
import {
  PROJECT_MANAGER_TABS, initialPaginationConfiguration, ROLES_ACCESS_TYPES, CADENCE_TABS
} from 'constants/MiscConstant';
import ProjectService from 'services/ProjectService';
import { useDispatch, useSelector } from 'react-redux';
import { mapper } from 'utils/mapper';
import { ProjectMapping } from 'constants/ProjectMapping';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PROJECT_TIMELINE } from 'configs/AppConfig';
import { hideMessage } from 'store/slices/projectDetailsSlice';
import useFilter from 'utils/hooks/useFilter';
import { TABLE_ROWS } from 'constants/DropdownOptions';
import Pagination from 'components/shared-components/DataTable/Pagination';
import { Card } from 'components/shared-components/Card';
import {
  getColumnWidth, getDateRanges, getRangeActions, parseTimelineRanges
} from 'utils/utils';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import { DATE_FORMAT_YYYY_MM_DD, DATE_FORMAT_MM_YYYY } from 'constants/DateConstant';
import Loading from 'components/shared-components/Loading';
import ProjectFilter from 'components/shared-components/ProjectFilter';
import { Segments } from 'components/shared-components/Segment';
import ProjectDetailsForm from './project-details/project-details-form/ProjectDetailsForm';
import TooltipContent from './project-timelines/SubStageToolTip';

const { ADMIN, SUPER_ADMIN } = ROLES_ACCESS_TYPES;
const { RangePicker } = DatePicker;

const ProjectManagerDashboard = () => {
  const { page: initialPage, pageSize: initialPageSize } = initialPaginationConfiguration;
  const [isProjectDetailsVisible, setProjectDetailsVisibility] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [tasks, setTasks] = useState(tasksMockData);
  const [ganttChartDetails, showGanttChartDetails] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState(PROJECT_MANAGER_TABS.MY_PROJECTS);
  const [searchParams, setSearchParams] = useSearchParams();

  const [myProjects, setMyProjects] = useState([]);
  const [otherProjects, setOtherProjects] = useState([]);
  const [pageOptions, setPageOptions] = useState(initialPaginationConfiguration);
  const [countOfProjects, setCountOfProjects] = useState(0);
  const [projectRange, setProjectRange] = useState([]);
  const [dateRanges, setDateRanges] = useState([]);
  const [viewDate, setViewDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [appliedFilters, clearFilters] = useFilter('ProjectFilter');
  const cadenceType = searchParams.get('cadenceType') || CADENCE_TABS.AGILE.value;

  const {
    auth: {
      userProfile: { email },
      user
    },
    projectDetails: {
      message: actionMessage,
      showMessage,
      status,
      projectCadence: { agile: agileDetails, sdlc: sdlcDetails }
    }
  } = useSelector(({ auth, projectDetails }) => ({
    auth,
    projectDetails
  }));

  const handleExpanderClick = (task) => {
    setTasks(tasks.map((taskRecord) => (taskRecord.id === task.id ? task : taskRecord)));
  };

  const ganttChartToggle = (checked) => {
    showGanttChartDetails(checked);
  };

  const getProjectList = async (
    customRanges,
    page,
    pageSize
  ) => {
    try {
      const filterOr = encodeURIComponent(`createdBy|${email}&projectManager|${email}`);
      const response = await ProjectService.getProjectList(
        {
          filterOr, page: page - 1, pageSize, filterAnd: encodeURIComponent(`projectCadence|${cadenceType}`)
        }
      );
      const { data: myProjectList } = response;
      const { content = [] } = myProjectList;

      if (content.length) {
        const ranges = customRanges || getDateRanges(content);
        const rangeAction = getRangeActions(cadenceType);

        const queryString = `fromDate=${ranges[0].format(DATE_FORMAT_YYYY_MM_DD)}&toDate=${ranges[1].format(DATE_FORMAT_YYYY_MM_DD)}`;
        const rangeResponse = await rangeAction(queryString);

        const { data: { sprints = [], quarters = [] } = {} } = rangeResponse;
        const ganttChartRanges = cadenceType === methodologyType.AGILE_CAPS
          ? sprints : quarters;
        const transformedProjectList = content.map((obj) => mapper(ProjectMapping, obj));
        const transformedRange = parseTimelineRanges(ganttChartRanges, cadenceType);
        setMyProjects(transformedProjectList);
        setCountOfProjects(myProjectList.totalElements);
        setProjectRange(transformedRange);
        if (!customRanges) {
          setDateRanges(ranges);
        }
      } else {
        setDateRanges([]);
        setMyProjects([]);
        setCountOfProjects(0);
      }
    } catch ({ message, code }) {
      setDateRanges([]);
      setMyProjects([]);
      if (code !== '1002') {
        notification.error({ message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getOtherProjectList = async (customRanges, page, pageSize, filterAnd = '') => {
    try {
      const excludeProjectManagerIds = encodeURIComponent(email);
      const cadenceTypeEncodedValue = encodeURIComponent(`projectCadence|${cadenceType}`);
      const response = await ProjectService.getProjectList(
        {
          excludeProjectManagerIds, page: page - 1, pageSize, filterAnd: `${cadenceTypeEncodedValue}${filterAnd}`
        }
      );
      const { data: myProjectList } = response;
      const { content } = myProjectList;
      if (content.length) {
        const ranges = customRanges || getDateRanges(content);
        const rangeAction = getRangeActions(cadenceType);

        const queryString = `fromDate=${ranges[0].format(DATE_FORMAT_YYYY_MM_DD)}&toDate=${ranges[1].format(DATE_FORMAT_YYYY_MM_DD)}`;
        const rangeResponse = await rangeAction(queryString);

        const { data: { sprints = [], quarters = [] } = {} } = rangeResponse;
        const ganttChartRanges = cadenceType === methodologyType.AGILE_CAPS
          ? sprints : quarters;
        const transformedRange = parseTimelineRanges(ganttChartRanges, cadenceType);

        const transformedProjectList = content?.map((ct) => mapper(ProjectMapping, ct));
        setOtherProjects(transformedProjectList);
        setCountOfProjects(myProjectList.totalElements);
        setProjectRange(transformedRange);
        if (!customRanges) {
          setDateRanges(ranges);
        }
      } else {
        setDateRanges([]);
        setOtherProjects([]);
        setCountOfProjects(0);
      }
    } catch ({ message, code }) {
      setDateRanges([]);
      setOtherProjects([]);
      if (code !== '1002') {
        notification.error({ message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openNewProjectModal = () => {
    if (agileDetails || sdlcDetails) {
      setProjectDetailsVisibility(true);
    } else {
      let message = t('component.project.manager.button.startProject.projectManager.candenceNotSet');
      if (user === ADMIN.key || user === SUPER_ADMIN.key) {
        message = t('component.project.manager.button.startProject.admin.candenceNotSet');
      }
      notification.error({ message });
    }
  };

  const initProjectList = (customRanges) => {
    setIsLoading(true);
    if (selectedTab === PROJECT_MANAGER_TABS.MY_PROJECTS) {
      getProjectList(customRanges, initialPage, initialPageSize);
    } else if (selectedTab === PROJECT_MANAGER_TABS.OTHER_PROJECTS) {
      getOtherProjectList(customRanges, initialPage, initialPageSize, appliedFilters?.uri);
    }
  };

  useEffect(() => {
    if (showMessage) {
      if ((actionMessage === t('component.project.manager.project.details.userUpdated.success.message')
        || actionMessage === t('component.project.manager.project.details.userAdded.success.message'))) {
        initProjectList();
      }
      notification[status]({ message: actionMessage });
      dispatch(hideMessage());
    }
  }, [showMessage]);

  useEffect(() => {
    if (email && !isProjectDetailsVisible) {
      initProjectList();
    }
  }, [selectedTab, email, cadenceType]);

  useEffect(() => {
    const projectRangeKeys = Object.keys(projectRange);

    if (projectRangeKeys.length) {
      const dateToView = new Date(projectRange[projectRangeKeys[0]]?.startDate);
      setViewDate(dateToView);
    }
  }, [projectRange]);

  const isYourProject = () => selectedTab === PROJECT_MANAGER_TABS.MY_PROJECTS;

  const handleToggle = (value) => {
    if (value === PROJECT_MANAGER_TABS.OTHER_PROJECTS) {
      setMyProjects([]);
      setSelectedTab(value);
      showGanttChartDetails(false);
      setPageOptions(initialPaginationConfiguration);
    } else if (value === PROJECT_MANAGER_TABS.MY_PROJECTS) {
      setOtherProjects([]);
      setSelectedTab(value);
      showGanttChartDetails(false);
      setPageOptions(initialPaginationConfiguration);
    }
  };

  const handleOtherProjectFilter = (filterAnd) => {
    setIsLoading(true);
    getOtherProjectList(dateRanges.length
      ? dateRanges : false, initialPage, pageOptions.pageSize, filterAnd);
  };

  const handleOtherProjectClearFilter = () => {
    clearFilters();
    setIsLoading(true);
    if (selectedTab === PROJECT_MANAGER_TABS.OTHER_PROJECTS) {
      getOtherProjectList(dateRanges, initialPage, initialPageSize);
      setPageOptions(initialPaginationConfiguration);
    }
  };

  const projectToggler = () => (

    <Row className="top-bar-container">
      <Col className="col-left">
        <Segments
          id="project-segments"
          options={[{ value: PROJECT_MANAGER_TABS.MY_PROJECTS, label: t('component.project.manager.gantt.chart1.title') },
            { value: PROJECT_MANAGER_TABS.OTHER_PROJECTS, label: t('component.project.manager.gantt.chart2.title') }]}
          onChange={handleToggle}
          value={selectedTab}
          disabled={isLoading} />
      </Col>
      <Col className="col-right">
        {isYourProject() ? (
          <>
            <Button type="primary" className="mr-4" id="add-existing-project" onClick={() => handleToggle(PROJECT_MANAGER_TABS.OTHER_PROJECTS)}>{t('component.project.manager.button.addExistingProject')}</Button>
            <Button onClick={openNewProjectModal} id="start-new-project">{t('component.project.manager.button.startProject')}</Button>
          </>
        )
          : (
            <ProjectFilter
              onApplyFilter={handleOtherProjectFilter}
              onClearFilter={handleOtherProjectClearFilter} />
          )}
      </Col>
    </Row>
  );

  const handleRowClick = (task) => {
    setProjectDetailsVisibility(true);
    setProjectId(task.id);
  };

  const onChangePaginationHandler = (pagination) => {
    const { current: page, pageSize } = pagination;
    setIsLoading(true);
    setPageOptions({ page, pageSize });
    if (selectedTab === PROJECT_MANAGER_TABS.MY_PROJECTS) {
      getProjectList(dateRanges, page, pageSize);
    } else if (selectedTab === PROJECT_MANAGER_TABS.OTHER_PROJECTS) {
      getOtherProjectList(dateRanges, page, pageSize, appliedFilters?.uri);
    }
  };

  const timelineClickHandler = (task) => {
    const { projectId: pId } = task;
    navigate({
      pathname: PROJECT_TIMELINE,
      search: `?projectId=${pId}`
    });
  };

  const onRangeChange = (value) => {
    if (value) {
      const startDate = value[0].startOf('month');
      const endDate = value[1].endOf('month');
      setDateRanges([startDate, endDate]);
      initProjectList([startDate, endDate]);
    }
  };

  const handleCadenceToggle = (cadence) => {
    setSearchParams({ cadenceType: cadence });
  };

  return isProjectDetailsVisible ? (
    <ProjectDetailsForm
      projectId={projectId}
      setProjectId={setProjectId}
      isVisible={isProjectDetailsVisible}
      setVisible={setProjectDetailsVisibility} />
  ) : (
    <Card
      customizedHeader={projectToggler()}
      bordered={false}
      heading={isYourProject() ? t('component.project.manager.gantt.chart1.title') : t('component.project.manager.gantt.chart2.title')}
      tagText={`${countOfProjects} ${t('component.user.dashboard.label.projects')}`}
      actionBtn={myProjects?.length > 0 || otherProjects?.length > 0
        ? (
          <>
            <span>{t('component.project.manager.gantt.chart.showDetails')}</span>
            <Switch id="gantt-chart-details" onChange={ganttChartToggle} className="mb-1 ml-2" disabled={isLoading} />
          </>
        ) : null}>
      {
        !isLoading ? (
          <>
            <Row justify="space-between" className="mt-2">
              <Col>
                <Segments
                  options={[CADENCE_TABS.AGILE, CADENCE_TABS.SDLC]}
                  onChange={handleCadenceToggle}
                  value={cadenceType}
                  disabled={isLoading}
                  id="project-cadence-toggle" />
              </Col>
              <Col>
                <RangePicker id="project-range-picker" onChange={onRangeChange} format={DATE_FORMAT_MM_YYYY} value={dateRanges} picker="month" />
              </Col>
            </Row>
            <div className="text-center gantt-chart-container mt-3">
              {((isYourProject() && myProjects?.length > 0)
                || (!isYourProject() && otherProjects.length > 0)) ? (
                  <Gantt
                    tasks={selectedTab === PROJECT_MANAGER_TABS.MY_PROJECTS
                      ? myProjects
                      : otherProjects}
                    viewMode={ViewMode.Range}
                    columnWidth={getColumnWidth(cadenceType)}
                    headerHeight={64}
                    listCellWidth={ganttChartDetails ? '120px' : '200px'}
                    ranges={projectRange}
                    onExpanderClick={handleExpanderClick}
                    onRowClick={handleRowClick}
                    onClick={timelineClickHandler}
                    barFill={45}
                    headers={[...headers.slice(0, 2),
                      ...(ganttChartDetails ? headers.slice(2) : [])
                    ]}
                    TooltipContent={TooltipContent}
                    onStageRowClick={timelineClickHandler}
                    viewDate={viewDate} />
                ) : (<Empty className="m-2" />)}
            </div>
          </>
        ) : (
          <div className="my-4">
            <Loading />
          </div>
        )
      }
      {countOfProjects > 0 && (
        <Pagination
          pagination={{
            defaultPageSize: pageOptions.pageSize,
            pageSize: pageOptions.pageSize,
            current: pageOptions.page,
            pageSizeOptions: TABLE_ROWS,
            showSizeChanger: false,
            total: countOfProjects
          }}
          onChange={onChangePaginationHandler} />
      )}
    </Card>
  );
};

export default ProjectManagerDashboard;
