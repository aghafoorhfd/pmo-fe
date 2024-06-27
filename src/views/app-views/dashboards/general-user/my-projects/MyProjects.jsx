import {
  Col,
  Empty, Row, Switch, notification
} from 'antd';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import {
  headers
} from 'mock/data/general-user';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/shared-components/Card';
import {
  parseTimelineRanges, getColumnWidth, getDateRanges, getRangeActions, getDefaultSearchParam
} from 'utils/utils';
import { mapper } from 'utils/mapper';
import { ProjectMapping } from 'constants/ProjectMapping';
import ProjectFilter from 'components/shared-components/ProjectFilter';
import { getMonitoredStats, getTaggedStats } from 'store/slices/riskManagementSlice';
import { CADENCE_TABS, MY_CONFLICT_STATUS, initialPaginationConfiguration } from 'constants/MiscConstant';
import { useDispatch, useSelector } from 'react-redux';
import './MyProjects.css';
import ProjectService from 'services/ProjectService';
import { DATE_FORMAT_YYYY_MM_DD } from 'constants/DateConstant';
import Loading from 'components/shared-components/Loading';
import Pagination from 'components/shared-components/DataTable/Pagination';
import { TABLE_ROWS } from 'constants/DropdownOptions';
import useFilter from 'utils/hooks/useFilter';
import { Segments } from 'components/shared-components/Segment';
import { useSearchParams } from 'react-router-dom';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import MyProjectStatus from './data-widget/MyProjectStatus';

const MyProjects = () => {
  const { page: initialPage, pageSize: initialPageSize } = initialPaginationConfiguration;
  const [projectRange, setProjectRange] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [countOfProjects, setCountOfProjects] = useState(0);
  const [ganttChartDetails, showGanttChartDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewDate, setViewDate] = useState(null);
  const [pageOptions, setPageOptions] = useState(initialPaginationConfiguration);

  const [appliedFilters, clearFilters] = useFilter('ProjectFilter');
  const {
    projectCadence: { agile, sdlc }
  } = useSelector(({ projectDetails }) => projectDetails);
  const cadenceType = searchParams.get('cadenceType') || getDefaultSearchParam(agile, sdlc);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { IMPACTED, PINNED } = MY_CONFLICT_STATUS;

  useEffect(() => {
    dispatch(getTaggedStats({ conflictStatus: IMPACTED }));
    dispatch(getMonitoredStats({ conflictStatus: PINNED }));
  }, []);

  const ganttChartToggle = (checked) => {
    showGanttChartDetails(checked);
  };

  const getProjectList = async (
    page,
    pageSize,
    filterAnd = ''
  ) => {
    setIsLoading(true);
    try {
      const projectCadenceUri = encodeURIComponent(`projectCadence|${cadenceType}`);
      const response = await ProjectService.getProjectList(
        {
          page: page - 1, pageSize, filterAnd: `${projectCadenceUri}${filterAnd}`
        }
      );
      const { data: myProjectList } = response;
      const { content = [] } = myProjectList;

      if (content.length) {
        const ranges = getDateRanges(content);
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
      } else {
        setMyProjects([]);
        setCountOfProjects(0);
      }
    } catch ({ message }) {
      setMyProjects([]);
      notification.error({ message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cadenceType) {
      getProjectList(initialPage, initialPageSize, appliedFilters?.uri);
    }
  }, [cadenceType]);

  useEffect(() => {
    const projectRangeKeys = Object.keys(projectRange);
    if (projectRangeKeys.length) {
      const dateToView = new Date(projectRange[projectRangeKeys[0]]?.startDate);
      setViewDate(dateToView);
    }
  }, [projectRange]);

  const onChangePaginationHandler = (pagination) => {
    const { current: page, pageSize } = pagination;
    setIsLoading(true);
    setPageOptions({ page, pageSize });
    getProjectList(page, pageSize, appliedFilters?.uri);
  };

  const handleProjectFilter = (filterAnd) => {
    getProjectList(initialPage, pageOptions.pageSize, filterAnd);
  };

  const handleProjectClearFilter = () => {
    clearFilters();
    setIsLoading(true);
    getProjectList(initialPage, initialPageSize);
    setPageOptions(initialPaginationConfiguration);
  };

  const handleCadenceToggle = (cadence) => {
    setSearchParams({ cadenceType: cadence });
  };

  return (
    <>
      <Card>
        <Row>
          <Col>
            <Segments
              options={[CADENCE_TABS.AGILE, CADENCE_TABS.SDLC]}
              onChange={handleCadenceToggle}
              value={cadenceType}
              disabled={isLoading} />
          </Col>
        </Row>
      </Card>
      {
        !isLoading ? (
          <>
            <MyProjectStatus
              cadenceType={cadenceType} />
            <Card
              bordered={false}
              heading={t('component.general.user.gantt.chart.title')}
              tagText={`${countOfProjects} ${t('component.user.dashboard.label.projects')}`}
              actionBtn={(
                <div className="d-flex align-items-center">
                  {myProjects?.length > 0
                  && (
                    <div>
                      <span>{t('component.general.user.gantt.chart.showDetails')}</span>
                      <Switch onChange={ganttChartToggle} className="mb-1 ml-2" />
                    </div>
                  )}

                  <div className="ml-3">
                    <ProjectFilter
                      onApplyFilter={handleProjectFilter}
                      onClearFilter={handleProjectClearFilter} />
                  </div>
                </div>
            )}>
              <div className="text-center gantt-chart-container mt-3">
                {myProjects?.length > 0
                  ? (
                    <Gantt
                      tasks={myProjects}
                      viewMode={ViewMode.Range}
                      columnWidth={getColumnWidth(cadenceType)}
                      headerHeight={64}
                      listCellWidth={ganttChartDetails ? '120px' : '200px'}
                      ranges={projectRange}
                      barFill={45}
                      headers={[...headers.slice(0, 2),
                        ...(ganttChartDetails ? headers.slice(2) : [])
                      ]}
                      viewDate={viewDate} />
                  ) : (<Empty className="m-2" />)}
              </div>
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

          </>
        ) : (
          <div className="my-4">
            <Loading />
          </div>
        )
    }
    </>
  );
};

export default MyProjects;
