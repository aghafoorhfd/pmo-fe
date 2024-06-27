import React, { useEffect, useState } from 'react';
import DataTable from 'components/shared-components/DataTable';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/shared-components/Card';
import { initialPaginationConfiguration, REQUEST_STATUS } from 'constants/MiscConstant';
import ResourceService from 'services/ResourceService';
import { useSelector } from 'react-redux';
import { ROLES } from 'constants/RolesConstant';
import { getColumns } from './ResourceRequestTableConfig';
import './resource-request.css';
import ResourceAssignment from './resource-assignment/ResourceAssignment';

const ResourceRequests = () => {
  const { t } = useTranslation();
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState([]);
  const [pagination, setPagination] = useState(initialPaginationConfiguration);
  const [selectedRequest, setSelectedRequest] = useState({});

  const { user, userProfile: { id } } = useSelector(({ auth }) => (auth));

  const getRequestList = async (pageOptions = initialPaginationConfiguration) => {
    try {
      setLoading(true);
      const { data } = await ResourceService.getResourceRequestList(
        pageOptions.page - 1,
        pageOptions.pageSize,
        REQUEST_STATUS.IN_PROGRESS,
        null,
        user !== ROLES.SUPER_ADMIN ? id : null
      ) || {};
      setRequestData(data);
    } catch ({ message }) {
      notification.error({ message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getRequestList();
    }
  }, [id]);

  const handlePageOptionChange = (pageOptions) => {
    const { current: page, pageSize } = pageOptions;
    setPagination({ page, pageSize });
    getRequestList({ page, pageSize });
  };

  const handleResourceAssign = (request) => {
    setSelectedRequest(request);
    setModalVisibility(true);
  };
  const handleModalClose = (fetch) => {
    setModalVisibility(false);
    if (fetch) {
      getRequestList();
    }
  };

  if (isModalVisible && selectedRequest) {
    return (
      <ResourceAssignment request={selectedRequest} handleClose={handleModalClose} />
    );
  }

  return (
    <Card
      heading={t('component.project.manager.resources.newResourcesRequest')}
      description={t('component.project.manager.resources.newResourcesRequestDescription')}
      tagText={t('component.project.manager.resources.newResourcesRequestCount', { count: requestData?.totalElements })}>
      <div className="mt-3">
        <DataTable
          dataI="resource-request"
          columns={getColumns(handleResourceAssign)}
          data={requestData?.content || []}
          currentPage={pagination.page}
          pageSize={pagination.pageSize}
          handleChange={handlePageOptionChange}
          loading={isLoading}
          showPagination
          totalElements={requestData?.totalElements || 0}
          scrollXWidth={1500} />
      </div>
    </Card>
  );
};

export default ResourceRequests;
