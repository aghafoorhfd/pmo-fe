import React, { useState, useEffect, Suspense } from 'react';
import {
  Button, Spin, notification, Form
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

// Helper components
import DataTable from 'components/shared-components/DataTable';
import { Card } from 'components/shared-components/Card';
import { useTranslation } from 'react-i18next';
import {
  filters, getResourceTeamList, hideMessage, resetResourceDataFetched
} from 'store/slices/resourceTeamSlice';
import Loading from 'components/shared-components/Loading';
import { useNavigate } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { ROLES_ACCESS_TYPES } from 'constants/MiscConstant';
import { noop } from 'lodash';
import { TableColumns } from './resource-team-table-columns/TableColumns';
import './Styles.css';

const ResourceTeamForm = React.lazy(() => import('./ResourceTeamForm'));

export default function ResourceTeam() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {
    resourceTeam: {
      data,
      loading,
      showMessage,
      message,
      status,
      filter: { pageNumber, pageSize }
    },
    auth: {
      user
    }
  } = useSelector((state) => ({
    resourceTeam: state.resourceTeam,
    auth: state.auth
  }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState();
  const { resourceTeamData: { content = [], totalElements = 0 } = {} } = data;
  const notificationParam = {
    message
  };

  const isAdmin = user === ROLES_ACCESS_TYPES.ADMIN.key
  || user === ROLES_ACCESS_TYPES.SUPER_ADMIN.key;

  const allowedRoles = [
    ROLES_ACCESS_TYPES.SUPER_ADMIN.key,
    ROLES_ACCESS_TYPES.RESOURCE_MANAGER.key
  ];

  const shouldRedirectToTeamSetup = allowedRoles.includes(user);

  const onAddUpdateTeamSuccess = () => {
    setIsModalOpen(false);
    setSelectedTeam({});
    form.resetFields();
  };

  useEffect(() => {
    if (showMessage) {
      if (message === t('component.resource.team.successMessage.teamAdded') || message === t('component.resource.team.successMessage.teamUpdated')) {
        onAddUpdateTeamSuccess();
        dispatch(getResourceTeamList());
      }
      notification[status](notificationParam);
      dispatch(hideMessage());
    }
    return () => {
      dispatch(resetResourceDataFetched());
    };
  }, [showMessage]);

  useEffect(() => {
    dispatch(getResourceTeamList());
  }, []);

  const tableLoading = {
    spinning: loading,
    indicator: <Spin />
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleChange = (pagination) => {
    const { current, pageSize: page } = pagination;
    dispatch(filters({
      pageNumber: current, pageSize: page
    }));
  };

  const operations = () => (
    isAdmin && (
      <Button onClick={showModal} type="primary" icon={<PlusOutlined />} id="add-resource-team">
        {t('component.resource.team.addResourceTeam')}
      </Button>
    )
  );

  return (
    <>
      {
        (isModalOpen || selectedTeam) && (
          <Suspense fallback={<Loading cover="content" />}>
            <ResourceTeamForm
              form={form}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam} />
          </Suspense>
        )
      }
      <Card
        heading={t('component.resource.team.heading')}
        description={t('component.resource.team.description')}
        actionBtn={operations()}
        tagText={`${totalElements} ${t('component.resource.team.label.teams')}`}
        isTagVisible
        showBorder>
        <DataTable
          dataI="resourceTeamTable"
          columns={TableColumns(setSelectedTeam, showModal, isAdmin)}
          data={content}
          loading={tableLoading}
          showPagination
          handleChange={handleChange}
          totalElements={totalElements}
          currentPage={pageNumber}
          pageSize={pageSize}
          onRow={({ id }) => ({
            onClick: shouldRedirectToTeamSetup ? () => { navigate(`${APP_PREFIX_PATH}/dashboards/resource-manager/resource-manager-team-setup/${id}`); } : noop // click row
          })} />
      </Card>
    </>
  );
}
