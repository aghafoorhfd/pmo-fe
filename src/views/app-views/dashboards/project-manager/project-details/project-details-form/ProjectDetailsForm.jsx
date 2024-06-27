import React, { useEffect, useState, useRef } from 'react';
import {
  Form, Button, Modal
} from 'antd';
import { Card } from 'components/shared-components/Card';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './project-details.css';
import {
  addProject,
  getConfigurationOptions, getGeneralUsers, inviteStakeHolders, updateProject, hideMessage
} from 'store/slices/projectDetailsSlice';
import ProjectService from 'services/ProjectService';
import { findBy, preSelectedStakeHolders } from 'utils/utils';
import Loading from 'components/shared-components/Loading';
import { ROLES } from 'constants/RolesConstant';
import { noop } from 'lodash';
import useFirstRender from 'utils/hooks/useFirstRender';
import { REQUEST_STATUS } from 'constants/MiscConstant';
import ResourceService from 'services/ResourceService';
import ProjectSetupMandatory from './ProjectSetupMandatory';
import ProjectLeads from './ProjectLeads';

const isProjectStarted = (
  timelines,
  resources,
  requestsTotalElements
) => timelines?.length > 0 || resources?.length > 0 || requestsTotalElements > 0;

const ProjectDetailsForm = ({
  projectId, isVisible, setVisible, setProjectId
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [loading, setLoading] = useState(projectId !== '');
  const [projectStarted, setProjectStarted] = useState(false);
  const [isElementOverlapping, setIsElementOverlapping] = useState(false);
  const projectDetailsHeaderRef = useRef(null);
  const projectDetailsFormRef = useRef(null);
  const [projectManagerName, setProjectManagerName] = useState('');
  const dispatch = useDispatch();

  const { confirm } = Modal;
  const {
    auth: { user, userProfile: { email } },
    projectDetails: {
      isGeneralUsersLoaded,
      generalUsers,
      message,
      showMessage
    }
  } = useSelector((state) => ({
    auth: state.auth,
    projectDetails: state.projectDetails
  }));
  const isFirstRender = useFirstRender();
  const projectManager = form.getFieldValue('projectManager');

  const checkFormAccess = () => (
    (user === ROLES.PROJECT_MANAGER
      && projectManager !== email)
  );

  const projectName = Form.useWatch('projectName', form);

  const getProjectNo = () => {
    ProjectService.getProjectNo().then(({ data: projectNumber }) => {
      form.setFieldValue('projectNumber', projectNumber);
    });
  };

  useEffect(() => {
    if (isVisible) {
      dispatch(getConfigurationOptions());
      dispatch(getGeneralUsers());
      if (!projectId) {
        getProjectNo();
      }
    }
  }, [isVisible]);

  const setFormData = async (pId) => {
    if (pId) {
      Promise.all([
        ProjectService.getProjectDetails(pId),
        ProjectService.getProjectTimeLine(pId),
        ResourceService.getResourceRequestList(0, 10, REQUEST_STATUS.IN_PROGRESS, pId)
      ]).then(([{ data: details }, { data: timelines }, { data: requests }]) => {
        setProjectStarted(
          isProjectStarted(timelines?.stages, details?.resources, requests?.totalElements)
        );
        form.setFieldsValue({
          ...details,
          techLead: details?.techLead?.email,
          stakeHolders: preSelectedStakeHolders(
            generalUsers,
            details?.stakeHolders?.map((stakeholder) => stakeholder?.email)
          )
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (isGeneralUsersLoaded && !isFirstRender) {
      setFormData(projectId);
    }
  }, [projectId, isGeneralUsersLoaded]);

  useEffect(() => {
    if ((showMessage && message === t('component.project.manager.project.details.userAdded.success.message')) || (showMessage && message === t('component.project.manager.project.details.userUpdated.success.message'))) {
      form.resetFields();
      setVisible(false);
      setProjectId('');
      const timer = setTimeout(() => dispatch(hideMessage()), 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [showMessage]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const techLeadUser = findBy('email', values?.techLead, generalUsers);
        const stakeHolderUsers = values?.stakeHolders?.map((stakeholder) => findBy('email', stakeholder?.value, generalUsers));
        const projectPayload = {
          ...values,
          projectManager: values.projectManager || '',
          projectManagerName,
          techLead: techLeadUser,
          stakeHolders: stakeHolderUsers
        };
        if (projectId) {
          dispatch(updateProject({
            projectId,
            data: projectPayload
          }));
        } else {
          dispatch(addProject(projectPayload));
        }
      }).catch(() => noop());
  };

  const handleInviteStakeHolders = (stakeHolderIds) => {
    const invitedHolderUsers = stakeHolderIds?.map((stakeHolderId) => findBy('email', stakeHolderId, generalUsers));
    dispatch(inviteStakeHolders({
      projectName,
      stakeHolders: invitedHolderUsers
    }));
  };

  const showConfirm = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h5>{t('component.message.unsavedChanges')}</h5>,
      onOk() {
        form.resetFields();
        setIsFormTouched(false);
        setVisible(false);
        setProjectId('');
      }
    });
  };

  const handleClose = () => {
    if (isFormTouched) {
      showConfirm();
    } else {
      form.resetFields();
      setVisible(false);
      setProjectId('');
    }
  };

  const actionButtons = () => (
    <>
      <Button size="small" onClick={handleClose} id="project-form-cancel-btn">
        {t('component.auth.cancel')}
      </Button>
      <Button size="small" type="primary" disabled={!isFormTouched} onClick={handleSubmit} id="project-form-save-btn">
        {t('component.common.save.label')}
      </Button>
    </>
  );

  useEffect(() => {
    const handleScroll = () => {
      const { current: formCurrent } = projectDetailsFormRef || {};
      const { top: projectDetailsFormTop } = formCurrent?.getBoundingClientRect() || {};
      const { current: headerCurrent } = projectDetailsHeaderRef || {};
      const { bottom: projectDetailsHeaderBottom } = headerCurrent?.getBoundingClientRect() || {};
      setIsElementOverlapping(projectDetailsFormTop <= projectDetailsHeaderBottom);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return loading ? (
    <div className="d-flex justify-content-center align-items-center project-details-loader"><Loading /></div>
  )
    : (
      <>
        <div ref={projectDetailsHeaderRef} className={`sticky-header ${isElementOverlapping ? 'sticky-header-overlapped' : ''}`}>
          <Card
            heading={projectId ? t('component.project.manager.project.details.heading.editProject') : t('component.project.manager.project.details.heading.addNewProject')}
            description={projectId ? t('component.project.manager.project.details.subHeading.updateDetails') : t('component.project.manager.project.details.subHeading.enterDetails')}
            actionBtn={actionButtons()}
            className="card-container" />
        </div>
        <div ref={projectDetailsFormRef}>
          <Form
            disabled={checkFormAccess()}
            form={form}
            layout="vertical"
            data-i="project-details-form"
            onFieldsChange={() => {
              setIsFormTouched(true);
            }}>
            <ProjectSetupMandatory
              isFormAccessable={checkFormAccess()}
              form={form}
              projectId={projectId}
              projectStarted={projectStarted} />
            <ProjectLeads
              isEditable={projectId}
              setIsFormTouched={setIsFormTouched}
              form={form}
              handleInviteStakeHolders={handleInviteStakeHolders}
              setProjectManagerName={setProjectManagerName} />
          </Form>
        </div>
      </>
    );
};

export default ProjectDetailsForm;
