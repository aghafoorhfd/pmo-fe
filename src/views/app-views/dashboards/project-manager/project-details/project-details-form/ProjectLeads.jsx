import React, { useState, useEffect } from 'react';
import {
  Row, Col, Form, Select,
  Button, Tag, notification, Typography
} from 'antd';
import { Card } from 'components/shared-components/Card';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Modal from 'components/shared-components/Modal';
import UserForm from 'components/common/user-form-modal';
import UserService from 'services/UserService';
import { ROLES } from 'constants/RolesConstant';
import { useDispatch, useSelector } from 'react-redux';
import { preSelectedStakeHolders } from 'utils/utils';
import { noop } from 'lodash';
import { invitationModalToggler, getGeneralUsers } from 'store/slices/projectDetailsSlice';
import { toggleForm, hideUserMessage } from 'store/slices/userSlice';
import ToolTip from 'components/shared-components/Tooltip';
import InviteStakeHolder from './InviteStakeHolderModal';
import './project-details.css';

const ProjectLeads = ({
  setIsFormTouched, form, handleInviteStakeHolders, isEditable, setProjectManagerName
}) => {
  const { t } = useTranslation();
  const [stakeHolderForm] = Form.useForm();
  const dispatch = useDispatch();
  const [checkInviteModal, setCheckInviteModal] = useState(false);
  const [isProjectManager, setIsProjectManager] = useState(false);
  const [generalUserOptions, setGeneralUserOptions] = useState([]);
  const [projectMangerOptions, setProjectManagerOptions] = useState([]);

  const {
    projectDetails: {
      message: validationMessage,
      showMessage,
      invitedStakeHolders,
      isInvitationModalVisible,
      generalUsers
    },
    auth: { userProfile },
    user: {
      message: userMessage,
      showMessage: userShowMessage
    }
  } = useSelector((state) => ({
    projectDetails: state.projectDetails,
    auth: state.auth,
    user: state.user
  }));

  const projectName = Form.useWatch('projectName', form);

  useEffect(() => () => {
    setGeneralUserOptions([]);
  }, []);

  const userOptionsMapper = (u) => ({
    label: `${u?.firstName} ${u?.lastName}`,
    value: u?.email
  });

  const getAllProjectManager = async () => {
    const response = await UserService.getUsersByType(ROLES.PROJECT_MANAGER);
    const { data: projectManagers } = response;
    if (projectManagers?.length) {
      const options = projectManagers.map(userOptionsMapper);
      const { projectManager } = form.getFieldsValue();
      if (isEditable && projectManager) {
        const projectManagerName = options.find(({ value }) => value === projectManager)?.label || '';
        setProjectManagerName(projectManagerName);
      }
      setProjectManagerOptions(options);
    }
  };

  const selectedStakeHolders = Form.useWatch('stakeHolders', form);

  useEffect(() => {
    if (showMessage) {
      if (validationMessage === t('component.project.manager.project.details.inviteStake.success.message')) {
        const previousStakeHolders = [...selectedStakeHolders || []];
        const newStakeHolders = preSelectedStakeHolders(
          generalUsers,
          invitedStakeHolders?.map((stakeholder) => stakeholder?.email)
        );
        form.setFieldsValue({ stakeHolders: [...previousStakeHolders, ...newStakeHolders] });
      }
    }
  }, [showMessage]);

  useEffect(() => {
    if (generalUsers?.length) {
      const options = generalUsers.map(userOptionsMapper);
      setGeneralUserOptions(options);
    }
    if (userProfile.accessType === ROLES.PROJECT_MANAGER) {
      const projectManagerName = `${userProfile?.firstName} ${userProfile?.lastName}`;
      setProjectManagerOptions([{
        label: projectManagerName,
        value: userProfile.email
      }]);
      setProjectManagerName(projectManagerName);
      if (!isEditable) {
        form?.setFieldsValue({
          projectManager: userProfile.email
        });
      }
      setIsProjectManager(true);
    } else {
      getAllProjectManager();
    }
  }, [generalUsers, userProfile]);

  useEffect(() => {
    if (userShowMessage) {
      if (userMessage === t('component.user.dashboard.userAdded.success.message')) {
        dispatch(getGeneralUsers());
      }
      dispatch(hideUserMessage());
    }
  }, [userShowMessage]);

  const getDropDown = (menu) => (
    <div>
      {menu}
      <div className="border-top">
        <Button
          icon={<PlusOutlined />}
          type="link"
          onClick={() => {
            dispatch(toggleForm());
          }}>
          {t('component.user.dashboard.addNewUser')}
        </Button>
      </div>
    </div>
  );

  const onInviteStakeHolder = () => {
    stakeHolderForm
      .validateFields()
      .then((values) => {
        const { stakeholder } = values;
        if (stakeholder && stakeholder?.length) {
          handleInviteStakeHolders(stakeholder);
        }
        stakeHolderForm.resetFields();
        dispatch(invitationModalToggler());
      }).catch((info) => {
        throw info;
      });
  };

  const onInviteStakeHolderHandler = () => {
    if (projectName) {
      dispatch(invitationModalToggler());
    } else {
      const message = t('component.project.manager.project.details.validation.invite.stakeholder.projectname.message');
      notification.error({ message });
    }
  };
  const handleProjectManagerChange = (value, option) => {
    setProjectManagerName(value ? option?.label : '');
    form.setFieldsValue({ projectManager: value });
  };

  return (
    <>
      <Card
        className="card-container"
        data-i="project-leads-section">
        <Row className="title-row">
          <Col>
            <Typography.Title level={4}>{t('component.project.manager.project.details.label.projectLead')}</Typography.Title>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={8} md={12} xs={24}>
            <Form.Item
              data-i="form-item-projectManager"
              name="projectManager"
              label={t('component.project.manager.project.details.label.projectManager')}
              hasFeedback>
              <Select
                className="input-fields"
                id="form-item-projectManager-inputField"
                allowClear
                showSearch
                disabled={isProjectManager}
                placeholder={t('component.project.manager.project.details.placeholder.projectManager')}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={projectMangerOptions}
                getPopupContainer={(trigger) => trigger.parentNode}
                onChange={handleProjectManagerChange} />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} xs={24}>
            <Form.Item
              data-i="form-item-techLead"
              name="techLead"
              label={t('component.project.manager.project.details.label.techLead')}
              hasFeedback>
              <Select
                className="input-fields"
                id="form-item-techLead-inputField"
                allowClear
                showSearch
                placeholder={t('component.project.manager.project.details.placeholder.techLead')}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={generalUserOptions}
                getPopupContainer={(trigger) => trigger.parentNode} />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} xs={24}>
            <Form.Item
              data-i="form-item-productManager"
              name="productManager"
              label={t('component.project.manager.project.details.label.productManager')}
              hasFeedback>
              <Select
                className="input-fields"
                id="form-item-productManager-inputField"
                allowClear
                placeholder={t('component.project.manager.project.details.placeholder.productManager')}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                options={generalUserOptions}
                getPopupContainer={(trigger) => trigger.parentNode}
                dropdownRender={(menu) => (
                  getDropDown(menu)
                )} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex flex-wrap">
            <Form.Item
              data-i="form-item-stakeHolder"
              name="stakeHolders"
              label={t('component.project.manager.project.details.label.stakeHolder')}
              hasFeedback>
              {selectedStakeHolders?.map((stakeHolder) => (
                stakeHolder && (
                <Tag color="success">
                  {stakeHolder?.label}
                </Tag>

                )
              ))}
              <ToolTip
                icon={(
                  <Button
                    type="link"
                    className="p-0"
                    icon={<PlusOutlined />}
                    id="invite-stake-holder-btn"
                    onClick={onInviteStakeHolderHandler}>
                    {t('component.project.manager.project.details.label.inviteStakeHolder')}
                  </Button>
)}
                title={t('component.project.manager.project.details.label.inviteStakeHolder.helperText')} />

            </Form.Item>
          </Col>
        </Row>
      </Card>
      {
        isInvitationModalVisible && (
          <Modal
            title={t('component.project.manager.project.details.stakeholder.heading.inviteStakeHolder')}
            isOpen={isInvitationModalVisible}
            confirmOnCancel={checkInviteModal}
            onCancel={() => {
              dispatch(invitationModalToggler());
              setCheckInviteModal(false);
              stakeHolderForm.resetFields();
            }}
            okText={t('component.user.dashboard.sendInvite')}
            onOk={stakeHolderForm.submit}>
            <InviteStakeHolder
              getDropDown={getDropDown}
              setIsFormTouched={setIsFormTouched}
              setCheckInviteModal={setCheckInviteModal}
              form={stakeHolderForm}
              handleSubmit={onInviteStakeHolder}
              generalUserOptions={generalUserOptions}
              selectedStakeHolders={selectedStakeHolders} />
          </Modal>
        )
      }
      <UserForm
        setSelectedRecord={noop}
        onlyGeneralUser />
    </>
  );
};

ProjectLeads.propTypes = {
  handleInviteStakeHolders: PropTypes.func
};

ProjectLeads.defaultProps = {
  handleInviteStakeHolders: noop
};

export default ProjectLeads;
