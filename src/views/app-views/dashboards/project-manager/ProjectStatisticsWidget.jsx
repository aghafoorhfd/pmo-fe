import React, { useEffect, useState } from 'react';
import {
  Col, notification, Row, Select, Switch, Typography
} from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { noop } from 'lodash';
import { createOptionList } from 'utils/utils';
import ProjectService from 'services/ProjectService';
import { setSelectedProjectDetails, setProjectList } from 'store/slices/projectDetailsSlice';
import { useDispatch, useSelector } from 'react-redux';
import './ProjectStatisticsWidget.css';
import { Card } from 'components/shared-components/Card';
import { PROJECT_ID_KEY } from 'constants/MiscConstant';

const ProjectStatisticWidget = ({
  projectId,
  isProjectSelectable,
  onProjectSelection,
  contentAddon,
  onLoadingFinish,
  fetchAllProjects
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    projectList,
    selectedProjectDetails: projectDetails
  } = useSelector((state) => (state.projectDetails));

  const { Text } = Typography;
  const [projectDetailsLoading, setProjectDetailsLoading] = useState(true);
  const [allProjectsLoading, setAllProjectsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState();
  const [showDetails, setShowDetails] = useState(false);

  const getProjectDetails = async () => {
    try {
      const { data: details } = await ProjectService.getProjectDetails(selectedProjectId);
      dispatch(setSelectedProjectDetails({ ...details, id: selectedProjectId }));
    } catch (err) {
      const { message } = err;
      notification.error({ message });
    } finally {
      setProjectDetailsLoading(false);
    }
  };

  const getSessionProjectId = (options) => {
    const sessionProjectId = sessionStorage.getItem(PROJECT_ID_KEY);
    const isValidSessionProjectId = sessionProjectId && options.some(
      ({ value: pID }) => pID === sessionProjectId
    );
    return isValidSessionProjectId ? sessionProjectId : null;
  };

  const getProjectOptions = async () => {
    try {
      const { data } = await (fetchAllProjects
        ? ProjectService.getOtherImpactedProjects()
        : ProjectService.getProjectNames());
      const options = createOptionList(data, 'projectId', 'projectName');
      dispatch(setProjectList(options));
      if (options?.length) {
        const isProjectExists = projectId && options.some(({ value: pID }) => pID === projectId);
        setSelectedProjectId(isProjectExists ? projectId
          : (getSessionProjectId(options) || options[0]?.value));
      } else {
        setProjectDetailsLoading(false);
        onLoadingFinish(false);
      }
    } catch ({ message }) {
      notification.error({ message });
    } finally {
      setAllProjectsLoading(false);
    }
  };

  useEffect(() => {
    if (isProjectSelectable) {
      getProjectOptions();
    }
  }, []);

  useEffect(() => {
    if (!isProjectSelectable && projectId) {
      setSelectedProjectId(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedProjectId) {
      if (isProjectSelectable) sessionStorage.setItem(PROJECT_ID_KEY, selectedProjectId);
      getProjectDetails();
      onProjectSelection(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleProjectSelection = (pId) => {
    setSelectedProjectId(pId);
  };
  return (
    <Card loading={isProjectSelectable ? !(!allProjectsLoading && !projectDetailsLoading) : projectDetailsLoading} className="project-statistics">
      <Row align="middle" justify="center">
        <Col span={3}><Text className="sub-heading">{`${t('component.project.manager.timelines.projectName')}:`}</Text></Col>
        <Col span={21} className="d-flex align-items-center">
          {isProjectSelectable
            ? (
              <Select
                value={selectedProjectId}
                size="small"
                showSearch
                allowClear={false}
                className="w-25"
                options={projectList}
                onChange={handleProjectSelection}
                placeholder={t('component.project.manager.project.details.placeholder.selectProject')}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                id="project-selector-field" />
            )
            : <Text className="sub-heading-value">{projectDetails?.projectName}</Text>}
          <Switch id="project-statistics-details" className="ml-2" onChange={() => setShowDetails(!showDetails)} />
          <span className="show-details-label ml-2">{t('component.project.manager.gantt.chart.showDetails')}</span>
        </Col>
      </Row>

      {
        showDetails && (
          <>
            {projectDetails?.overview && (
              <Row className="mt-2">
                <Col span={3}><Text className="sub-heading">{`${t('component.project.manager.timelines.overview')}:`}</Text></Col>
                <Col span={21}><Text className="sub-heading-value">{projectDetails.overview}</Text></Col>
              </Row>
            )}

            <Row justify="space-between" className="mt-2" wrap>

              <Col>
                <Text className="sub-heading mr-3">{`${t('component.project.manager.project.details.label.projectNumber')}:`}</Text>
                <Text className="sub-heading-value">{projectDetails.projectNumber}</Text>
              </Col>
              <Col>
                <Text className="sub-heading mr-3">{`${t('component.project.manager.project.details.label.category')}:`}</Text>
                <Text className="sub-heading-value">{projectDetails.category}</Text>
              </Col>

              <Col>
                <Text className="sub-heading mr-3">{`${t('component.project.manager.project.details.label.priority')}:`}</Text>
                <Text className="sub-heading-value">{projectDetails.priority}</Text>
              </Col>

              <Col>
                <Text className="sub-heading mr-3">{`${t('component.project.manager.project.details.label.department')}:`}</Text>
                <Text className="sub-heading-value">{projectDetails.department}</Text>
              </Col>

              <Col>
                <Text className="sub-heading mr-3">{`${t('component.project.manager.project.details.label.theme')}:`}</Text>
                <Text className="sub-heading-value">{projectDetails.theme}</Text>
              </Col>
            </Row>
          </>
        )
      }
      {
        // can be used to add extra elements
        contentAddon
      }
    </Card>
  );
};
ProjectStatisticWidget.propTypes = {
  projectId: PropTypes.string,
  isProjectSelectable: PropTypes.bool,
  onProjectSelection: PropTypes.func,
  onLoadingFinish: PropTypes.func,
  contentAddon: PropTypes.node,
  fetchAllProjects: PropTypes.bool
};
ProjectStatisticWidget.defaultProps = {
  projectId: undefined,
  isProjectSelectable: false,
  onProjectSelection: noop,
  onLoadingFinish: noop,
  contentAddon: null,
  fetchAllProjects: false
};

export default ProjectStatisticWidget;
