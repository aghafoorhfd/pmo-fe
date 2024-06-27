import React, { Suspense, useEffect, useState } from 'react';
import {
  Button, Form, Spin, Modal as AntModal, notification, Row, Col
} from 'antd';
import { useTranslation } from 'react-i18next';
import DataTable from 'components/shared-components/DataTable';
import {
  getResourceTeamById, hideMessage, removeResource, resetResourceDataFetched
} from 'store/slices/resourceTeamSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { STATUS } from 'constants/StatusConstant';
import { Card } from 'components/shared-components/Card';
import ProfileDetail from 'components/shared-components/ProfileDetail';
import TeamBulletin from 'components/shared-components/TeamBulletin';
import { resourceManagerTeamColumns } from './teamTableColumns';
import AddResourceFormModal from './addResourceFormModal';
import ResourceTeamForm from '../../resource-team/ResourceTeamForm';
import './index.css';

const tableLoading = {
  spinning: false,
  indicator: <Spin />
};

export default function ResourceManagerTeamSetup() {
  const { t } = useTranslation();
  const [addResourceForm] = Form.useForm();
  const [editTeamForm] = Form.useForm();
  const [showTeamsEditFormModal, setShowTeamsEditFormModal] = useState(false);
  const [showAddResourceFormModal, setShowAddResourceFormModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedResource, setSelectedResource] = useState({});
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const {
    resourceTeam: {
      data: {
        resourceTeamData: {
          description,
          teamName,
          otherResources = [],
          resourceManagers,
          teamLeads
        } = {}
      },
      showMessage,
      status,
      message,
      loading
    },
    auth: { userProfile: { id: userId } }
  } = useSelector((state) => ({
    resourceTeam: state.resourceTeam,
    auth: state.auth
  }));
  const { confirm } = AntModal;
  const onAddUpdateTeamSuccess = () => {
    setShowTeamsEditFormModal(false);
    setSelectedTeam({});
    editTeamForm.resetFields();
  };

  const closeAddResourceFormModal = () => {
    setShowAddResourceFormModal(false);
    setSelectedResource({});
    addResourceForm.resetFields();
    dispatch(resetResourceDataFetched());
  };

  useEffect(() => {
    if (showMessage) {
      if (status === STATUS.SUCCESS) {
        dispatch(getResourceTeamById(teamId));
        onAddUpdateTeamSuccess();
        closeAddResourceFormModal();
      }

      notification[status]({ message });
      dispatch(hideMessage());
    }
  }, [showMessage, selectedTeam]);

  useEffect(() => {
    dispatch(getResourceTeamById(teamId));
  }, []);

  const removeResourceHandler = (resourceId) => {
    dispatch(removeResource({ teamId, resourceId }));
  };

  const removeHandler = ({ resourceId }) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h5>{t('component.resource.team.remove.confirmation.message')}</h5>,
      onOk() {
        removeResourceHandler(resourceId);
      }
    });
  };

  const editHandler = (resource) => {
    setShowAddResourceFormModal(true);
    setSelectedResource(resource);
  };

  return (
    <>
      <ProfileDetail
        dataId="teamDescription"
        id="teamDescription"
        description={description}
        name={teamName}
        resourceManagers={resourceManagers}
        teamLeads={teamLeads}
        loading={loading} />
      <Row gutter={[16, 16]} className="team-setup-screen mb-4">
        <Col span={12}>
          <Card heading={t('component.resource.team.heading.resourceAllocation')} showBorder>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px', height: 'auto' }}>
              <div style={{ transform: 'rotate(-30deg)', fontSize: '23px' }}>
                <p>Coming Soon</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <TeamBulletin showMessageComposer teamId={teamId} userId={userId} />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            heading={t('sidenav.dashboard.resourceManager.team.setup')}
            actionBtn={(
              <Button
                type="default"
                data-i="add-resource-btn"
                id="add-resource-btn"
                onClick={() => setShowAddResourceFormModal(true)}>
                {t('component.resource.team.button.addResource')}
              </Button>
            )}
            showBorder>
            <DataTable
              data-i="resourceManagerTeamSetupTable"
              id="resourceId"
              columns={resourceManagerTeamColumns(editHandler, removeHandler)}
              data={otherResources}
              loading={tableLoading} />
          </Card>
        </Col>
      </Row>
      {
        showAddResourceFormModal && (
          <Suspense fallback={<Loading cover="content" />}>
            <AddResourceFormModal
              form={addResourceForm}
              open={showAddResourceFormModal}
              teamId={teamId}
              onClose={closeAddResourceFormModal}
              selectedResource={selectedResource}
              setSelectedResource={setSelectedResource}
              teamLeads={teamLeads} />
          </Suspense>
        )
      }
      {
        showTeamsEditFormModal && (
          <Suspense fallback={<Loading cover="content" />}>
            <ResourceTeamForm
              form={editTeamForm}
              isModalOpen={showTeamsEditFormModal}
              setIsModalOpen={setShowTeamsEditFormModal}
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam} />
          </Suspense>
        )
      }
    </>
  );
}
