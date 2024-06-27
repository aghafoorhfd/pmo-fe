import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Table from 'components/shared-components/DataTable';
import { useTranslation } from 'react-i18next';
import {
  Form, notification, Modal
} from 'antd';
import ProjectService from 'services/ProjectService';
import BasicTabs from 'components/shared-components/Tabs';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import ResourceService from 'services/ResourceService';
import { initialPaginationConfiguration, REQUEST_STATUS } from 'constants/MiscConstant';
import { Card } from 'components/shared-components/Card';
import { setSelectedProjectDetails } from 'store/slices/projectDetailsSlice';
import { getResourceRequestColumns } from './RequestResourceTableConfig';
import RequestResourcesForm from './RequestResourcesForm';
import ProjectStatisticWidget from '../project-manager/ProjectStatisticsWidget';
import './styles.css';

const { confirm } = Modal;

const {
  WITHDRAW, IN_PROGRESS, ASSIGNED, REJECTED
} = REQUEST_STATUS;
const RequestedResourceList = ({
  data, handleWithdrawRequest, isLoading, pagination, handlePageOptionChange,
  selectedStatus, onTabChange
}) => {
  const { t } = useTranslation();

  const getTable = (type) => (
    <Table
      data-i="request-resources-table"
      id="resourceRequestId"
      columns={getResourceRequestColumns(type, handleWithdrawRequest)}
      data={data?.content || []}
      currentPage={pagination.page}
      pageSize={pagination.pageSize}
      handleChange={handlePageOptionChange}
      loading={isLoading}
      showPagination
      totalElements={data?.totalElements || 0} />
  );

  const getMainTabs = () => [
    {
      label: t('sidenav.dashboard.userPendingRequests'),
      key: IN_PROGRESS,
      children: getTable(IN_PROGRESS)
    },
    {
      label: t('component.project.manager.resources.approved.requests'),
      key: ASSIGNED,
      children: getTable(ASSIGNED)
    },
    {
      label: t('component.project.manager.resources.declined.requests'),
      key: REJECTED,
      children: getTable(REJECTED)
    },
    {
      label: t('component.project.manager.resources.withdrawn.requests'),
      key: WITHDRAW,
      children: getTable(WITHDRAW)
    }
  ];

  return (
    <BasicTabs
      pillShaped
      items={getMainTabs()}
      onTabChange={onTabChange}
      selectedTab={selectedStatus} />
  );
};

const RequestResources = () => {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState(IN_PROGRESS);
  const [pagination, setPagination] = useState(initialPaginationConfiguration);

  const [requestData, setRequestData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const {
    selectedProjectDetails
  } = useSelector(({ projectDetails }) => (projectDetails));

  const getRequestList = async (pageOptions = initialPaginationConfiguration) => {
    try {
      const { data } = await ResourceService.getResourceRequestList(
        pageOptions.page - 1,
        pageOptions.pageSize,
        selectedStatus,
        projectId
      );
      setRequestData(data);
    } catch ({ message }) {
      notification.error({ message });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawRequest = async (requestId) => {
    try {
      await ResourceService.withdrawResourceRequest(requestId);
      notification.success({ message: t('component.project.manager.resources.success.withdrawResourceRequest') });
      getRequestList(pagination);
    } catch ({ message }) {
      notification.error({ message });
    }
  };

  const handleWithDrawConfirmation = (requestId) => {
    confirm({
      title: t('component.project.manager.resources.column.label.withDrawRequest.confirmation'),
      onOk() {
        handleWithdrawRequest(requestId);
      },
      onCancel() { }
    });
  };

  const handlePageOptionChange = (pageOptions) => {
    const { current: page, pageSize } = pageOptions;
    setPagination({ page, pageSize });
    getRequestList({ page, pageSize });
  };

  useEffect(() => {
    getRequestList(pagination);
  }, [selectedStatus]);

  const getProjectDetails = async () => {
    try {
      setLoading(true);

      const { data: details } = await ProjectService.getProjectDetails(projectId);
      dispatch(setSelectedProjectDetails({ ...details, id: projectId }));
    } catch (err) {
      const { message } = err;
      notification.error({ message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((!Object.keys(selectedProjectDetails || {})?.length) && projectId) {
      getProjectDetails();
    }
  }, [projectId]);

  const requestResource = async (payload) => {
    try {
      setLoading(true);
      await ResourceService.addResourceRequest(payload);
      form.resetFields();
      getRequestList(pagination);
      notification.success({ message: t('component.project.manager.resources.success.addResourceRequest') });
    } catch ({ message }) {
      notification.error({ message });
      setLoading(false);
    }
  };

  const onTabChange = (key) => {
    setPagination(initialPaginationConfiguration);
    setSelectedStatus(key);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = values;
        payload.resourceRequestDetails = payload.resourceRequestDetails.map((resource) => ({
          ...(({
            resourceDiscipline, priority, capacity, resourceStage
          }) => (
            {
              resourceDiscipline, priority, capacity, resourceStage
            })
          )(resource),
          fromDate: moment(resource.dateRange[0]).format('YYYY-MM-DD'),
          toDate: moment(resource.dateRange[1]).format('YYYY-MM-DD')

        }));
        payload.projectDetail = {
          projectId: selectedProjectDetails.id,
          projectName: selectedProjectDetails.projectName,
          department: selectedProjectDetails.department,
          domain: selectedProjectDetails.category,
          projectManagerEmail: selectedProjectDetails.projectManager,
          projectManagerName: selectedProjectDetails.projectManagerName || '',
          projectCadence: selectedProjectDetails.projectCadence
        };

        requestResource(payload);
      }).catch((info) => {
        throw info;
      });
  };

  useEffect(() => () => {
    dispatch(setSelectedProjectDetails(''));
  }, []);

  return (
    <>
      <ProjectStatisticWidget projectId={projectId} />
      <Card
        className="request-resource-card"
        heading={t('component.project.manager.resources.newResourcesRequest')}
        description={t('component.project.manager.resources.enterDetailsBelow')}>
        <div className="request-resource-form">
          <RequestResourcesForm
            form={form}
            handleSubmit={handleSubmit}
            isLoading={isLoading} />
        </div>
      </Card>
      <Card
        heading={t('component.project.manager.resources.requestResources')}
        description={t('component.user.dashboard.widget.description')}
        showBorder>
        <RequestedResourceList
          data={requestData}
          isLoading={isLoading}
          handleWithdrawRequest={handleWithDrawConfirmation}
          handlePageOptionChange={handlePageOptionChange}
          pagination={pagination}
          selectedStatus={selectedStatus}
          onTabChange={onTabChange} />
      </Card>
    </>
  );
};

export default RequestResources;
