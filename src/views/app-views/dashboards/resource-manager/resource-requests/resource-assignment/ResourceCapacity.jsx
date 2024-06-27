import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ResourceService from 'services/ResourceService';
import Loading from 'components/shared-components/Loading';
import { noop } from 'lodash';
import { getRangeActions } from 'utils/utils';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import ResourceCapacityGrid from './ResourceCapacityGrid';
import './index.css';
import ResourceAssignmentConfirmModal from './ResourceAssignmentConfirmModal';

const ResourceCapacity = ({ request, handleCapictySheetClose }) => {
  const { t } = useTranslation();
  const [headers, setHeaders] = useState([]);
  const [resourceCapacity, setResourceCapacity] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [isConfirmModalOpen, showConfirmModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState({});

  const initCapacityGrid = async () => {
    setLoading(true);
    try {
      const {
        resourceTeamId,
        resourceRequestDetail: { fromDate, toDate, resourceDiscipline },
        projectDetail: { projectCadence = methodologyType.AGILE_CAPS }
      } = request;
      const rangeAction = getRangeActions(projectCadence);

      const [projectRanges, capacity] = await Promise.all([
        rangeAction(`fromDate=${fromDate}&toDate=${toDate}`),
        ResourceService.getResourceCapacity(resourceTeamId, fromDate, toDate)
      ]);
      const { data: { sprints = [], quarters = [] } } = projectRanges || {};
      const ranges = projectCadence === methodologyType.SDLC_CAPS
        ? quarters : sprints;

      const { data: availableCapacity } = capacity || {};

      setHeaders([{
        name: t('component.resource.team.resourceName')
      }, ...ranges.map(({ name, startDate: rangeStartDate, endDate: rangeEndDate }) => ({
        name,
        start: rangeStartDate,
        end: rangeEndDate
      })),
      {
        name: t('component.table.column.actions')
      }]);
      const designationSpecificResources = availableCapacity.filter(
        (res) => res.designation === resourceDiscipline
      );
      setResourceCapacity(designationSpecificResources);
    } catch ({ message }) {
      notification.error({ message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initCapacityGrid();
  }, []);

  const handleCellClick = (selectedResource) => {
    setSelectedCell(selectedResource);
    showConfirmModal(true);
  };

  const handleResourceAssignment = async () => {
    showConfirmModal(false);
    handleCapictySheetClose(true);
  };

  const onConfirmModalClose = () => {
    showConfirmModal(false);
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <div className="resource-capacity-container d-flex flex-fill overflow-auto border border-radius-8 flex-wrap">
        <ResourceCapacityGrid
          headers={headers}
          resources={resourceCapacity}
          assignmentHandler={handleCellClick} />
      </div>
      <ResourceAssignmentConfirmModal
        isModalOpen={isConfirmModalOpen}
        onClose={onConfirmModalClose}
        request={request}
        handleResourceAssignment={handleResourceAssignment}
        selectedResource={selectedCell} />
    </>
  );
};

export default ResourceCapacity;

ResourceCapacity.propTypes = {
  request: PropTypes.objectOf,
  handleCapictySheetClose: PropTypes.func
};
ResourceCapacity.defaultProps = {
  request: {},
  handleCapictySheetClose: noop
};
