import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import '../project-manager/ProjectManagerDashboard.css';
import { useTranslation } from 'react-i18next';
import {
  Col, Empty, Row, Button, notification
} from 'antd';
import moment from 'moment';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_YYYY_MM_DD } from 'constants/DateConstant';
import { Card } from 'components/shared-components/Card';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import {
  getColumnWidth, getDateRanges, getRangeActions, mergeSubStagesIntoStages, parseTimelineRanges
} from 'utils/utils';
import { ResourceHeaders } from 'constants/ProjectManagerResourceMapping';
import ProjectService from 'services/ProjectService';
import ResourceService from 'services/ResourceService';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import { useSelector, useDispatch } from 'react-redux';
import Loading from 'components/shared-components/Loading';
import { ProjectStageMapping } from 'constants/ProjectMapping';
import { setSelectedProjectDetails } from 'store/slices/projectDetailsSlice';
import ProjectStatisticWidget from '../project-manager/ProjectStatisticsWidget';
import ResourceAllocationChart from './project-resources-widgets/ResourceAllocationChart';
import ResourceAllocationDonutChart from './project-resources-widgets/ResourceAllocationDonutChart';
import './index.css';
import TooltipContent from '../project-manager/project-timelines/SubStageToolTip';

const ProjectResourcesDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [projectResources, setProjectResources] = useState([]);
  const [projectRange, setProjectRange] = useState([]);
  const [resourceStats, setResourceStats] = useState({});
  const [viewDate, setViewDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const {
    projectDetails: { selectedProjectDetails: { projectCadence, id: pID } = {} } = {}
  } = useSelector(({ projectDetails }) => ({ projectDetails }));
  const projectId = searchParams.get('projectId');

  const getProjectData = async () => {
    try {
      setIsLoading(true);
      const stats = await ResourceService.getResourceStats(pID);
      setResourceStats(stats?.data?.resourceStats);
      const timelineResponse = await ProjectService.getProjectTimeLine(pID);
      const { data: { stages = [] } = {} } = timelineResponse;
      const projectResourcesList = await ProjectService.getProjectAssignedResources(pID);
      const { data: resourceStageList } = projectResourcesList;

      if (stages.length) {
        const projectStages = stages?.map((data) => {
          const { resourceStage, resources = [] } = resourceStageList.find(
            (resource) => resource.resourceStage === data.stageName
          ) || {};

          return ({
            ...data,
            resourceStage,
            resources,
            isResourceStageName: true,
            subStages: resources.map((resource) => ({
              isResourceSubStage: true,
              capacity: resource?.resourceDetail?.capacity,
              subStageName: resource.firstName,
              outlook: data.outlook,
              startDate: moment(resource?.resourceDetail?.fromDate)
                .format(DATE_FORMAT_DD_MM_YYYY),
              endDate: moment(resource?.resourceDetail?.toDate).format(DATE_FORMAT_DD_MM_YYYY)
            }))
          });
        });
        const [from, to] = getDateRanges(projectStages);
        const rangeAction = getRangeActions(projectCadence);
        const rangeResponse = await rangeAction(
          `fromDate=${from.format(DATE_FORMAT_YYYY_MM_DD)}&toDate=${to.format(DATE_FORMAT_YYYY_MM_DD)}`
        );
        const { data: { sprints = [], quarters = [] } = {} } = rangeResponse;
        const ganttChartRanges = projectCadence === methodologyType.AGILE_CAPS
          ? sprints : quarters;
        const transformedRange = parseTimelineRanges(ganttChartRanges, projectCadence);
        const transformedTasks = mergeSubStagesIntoStages(ProjectStageMapping, projectStages);
        setProjectResources(transformedTasks);
        setProjectRange(transformedRange);
      } else {
        setProjectRange([]);
        setProjectResources([]);
      }
    } catch (error) {
      notification.error({ message: error?.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const projectRangeKeys = Object.keys(projectRange);

    if (projectRangeKeys.length) {
      const dateToView = new Date(projectRange[projectRangeKeys[0]]?.startDate);
      setViewDate(dateToView);
    }
  }, [projectRange]);

  useEffect(() => {
    if (pID === projectId) {
      getProjectData();
    }
  }, [pID, projectId]);

  const handleRequestResource = () => {
    navigate(`${APP_PREFIX_PATH}/dashboards/project-manager/project-request-resources/${pID}`);
  };

  const handleExpanderClick = (task) => {
    setProjectResources(
      projectResources.map(
        (projectResource) => (projectResource.id === task.id ? task : projectResource
        )
      )
    );
  };

  const onProjectChange = (pId) => {
    setSearchParams({ projectId: pId });
  };
  useEffect(() => () => {
    dispatch(setSelectedProjectDetails(''));
    setProjectResources([]);
  }, []);

  return (
    <>
      <ProjectStatisticWidget
        projectId={projectId}
        isProjectSelectable
        onProjectSelection={onProjectChange}
        onLoadingFinish={setIsLoading} />

      <Row gutter={[16, 4]}>
        <Col xs={24} md={24} lg={12} xl={12}>
          <ResourceAllocationDonutChart stats={resourceStats} />
        </Col>
        <Col xs={24} md={24} lg={12} xl={12}>
          <ResourceAllocationChart stats={resourceStats} />
        </Col>
        <Col xs={24} md={24} lg={24} xl={24}>
          {
            !isLoading ? (
              <Card
                heading={t('component.project.manager.resources.card.heading')}
                actionBtn={(
                  <Button disabled={!projectId} onClick={handleRequestResource}>
                    {t('component.project.manager.resources.requestResources')}
                  </Button>
                  )}
                className="chartWidget"
                showBorder>
                { projectResources?.length > 0 ? (
                  <Gantt
                    TooltipContent={TooltipContent}
                    tasks={projectResources}
                    viewMode={ViewMode.Range}
                    columnWidth={getColumnWidth(projectCadence)}
                    headerHeight={64}
                    listCellWidth="200px"
                    barBackgroundColor="rgba(164,97,216,1)"
                    projectBackgroundColor="rgba(255,107,114,1)"
                    ranges={projectRange}
                    headers={ResourceHeaders}
                    barFill={45}
                    viewDate={viewDate}
                    onExpanderClick={handleExpanderClick} />
                ) : <Empty /> }
              </Card>

            ) : (
              <div className="my-4">
                <Loading />
              </div>
            )

          }

        </Col>
      </Row>
    </>
  );
};

export default ProjectResourcesDashboard;
