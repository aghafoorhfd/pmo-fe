import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTeam, editTeam } from 'store/slices/resourceTeamSlice';
import {
  Form, Input, Select, notification
} from 'antd';
import { useTranslation } from 'react-i18next';
import { STATUS } from 'constants/StatusConstant';
import Modal from 'components/shared-components/Modal/index';
import { DESIGNATION_TYPES, ROLES_ACCESS_TYPES } from 'constants/MiscConstant';
import UserService from 'services/UserService';
import { spaceValidator } from 'utils/utils';

export default function ResourceTeamForm(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [resourceManagers, setResourceManagers] = useState([]);

  const { RESOURCE_MANAGER } = ROLES_ACCESS_TYPES;
  const {
    resourceTeam: {
      fromLoading, showMessage, message, status
    },
    auth: {
      user,
      userProfile: {
        userName
      }
    }
  } = useSelector((state) => ({
    resourceTeam: state.resourceTeam,
    auth: state.auth
  }));

  const { SUCCESS } = STATUS;

  const {
    isModalOpen, setIsModalOpen, selectedTeam = {}, setSelectedTeam, form, isAdminDashboard
  } = props;

  const isResourceManager = user === ROLES_ACCESS_TYPES.RESOURCE_MANAGER.key;

  const parseToOptionList = (list = []) => list.map(({
    id, firstName, lastName, email, accessType
  }) => ({
    label: `${firstName} ${lastName} (${email})`,
    value: `${id} ${accessType} ${email}`
  }));

  const openNotification = () => {
    const notificationParam = {
      message
    };
    if (status === SUCCESS) {
      notification.success(notificationParam);
    } else {
      notification.error(notificationParam);
    }
  };

  const isEditTeamFormEnable = () => Object.keys(selectedTeam)?.length > 0;

  const populatedResourceManagers = () => {
    const { primaryResourceManager, secondaryResourceManager } = selectedTeam?.resources
      ?.reduce((acc, curr) => {
        if (curr.designation === DESIGNATION_TYPES.RESOURCE_MANAGER.key) {
          return {
            ...acc,
            [curr.primaryResourceManager ? 'primaryResourceManager' : 'secondaryResourceManager']: {
              label: `${curr.firstName} ${curr.lastName} (${curr.email})`,
              value: `${curr.resourceId} ${curr.designation} ${curr.email}`
            }
          };
        }

        return acc;
      }, { primaryResourceManager: null, secondaryResourceManager: null }) || {};

    return ({ primaryResourceManager, secondaryResourceManager });
  };

  useEffect(() => {
    const { primaryResourceManager, secondaryResourceManager } = populatedResourceManagers();

    form.setFieldsValue({
      id: selectedTeam.id,
      teamName: selectedTeam.teamName,
      description: selectedTeam.description,
      resourceManager1: primaryResourceManager,
      resourceManager2: secondaryResourceManager
    });
    if (showMessage) {
      openNotification();
    }
  }, [selectedTeam]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEditTeamFormEnable()) {
          const { resourceManager2, resourceManager1, ...formValue } = values;
          const resourceManager1Values = typeof resourceManager1 === 'string' ? resourceManager1?.split(' ') : resourceManager1?.value.split(' ');
          const resourceManager2Values = typeof resourceManager2 === 'string' ? resourceManager2?.split(' ') : resourceManager2?.value.split(' ');

          const resourceManager1Payload = [{
            email: resourceManager1Values[2],
            resourceId: resourceManager1Values[0],
            designation: resourceManager1Values[1],
            primaryResourceManager: true
          }];

          const resourceManager2Payload = resourceManager2Values ? [{
            email: resourceManager2Values[2],
            resourceId: resourceManager2Values[0],
            designation: resourceManager2Values[1]
          }] : [];

          dispatch(editTeam({
            ...formValue,
            resources: [
              ...resourceManager1Payload,
              ...resourceManager2Payload
            ]
          }));
        } else {
          const { resourceManager2, resourceManager1, ...formValues } = values;
          const resourceManager1Values = resourceManager1.split(' ');
          const resourceManager2Values = resourceManager2?.split(' ');

          const resourceManager1Payload = [{
            email: resourceManager1Values[2],
            resourceId: resourceManager1Values[0],
            designation: resourceManager1Values[1],
            primaryResourceManager: true
          }];

          const resourceManager2Payload = resourceManager2Values ? [{
            email: resourceManager2Values[2],
            resourceId: resourceManager2Values[0],
            designation: resourceManager2Values[1]
          }] : [];

          dispatch(addTeam({
            ...formValues,
            resources: [
              ...resourceManager1Payload,
              ...resourceManager2Payload
            ]
          }));
        }
      }).catch((err) => {
        throw err;
      }).finally(() => {
        setIsModalOpen(false);
      });
  };

  const onClose = () => {
    form.resetFields();
    setIsModalOpen(false);
    setIsFormTouched(false);
    if (!isAdminDashboard) setSelectedTeam({});
  };

  const secondaryActionsButtons = () => (
    [
      {
        action: 'close',
        block: true,
        colSpan: 12,
        disable: fromLoading,
        loading: fromLoading,
        label: t('component.auth.cancel'),
        type: 'default'
      },
      {
        action: form.submit,
        block: true,
        colSpan: 12,
        disable: fromLoading,
        loading: fromLoading,
        label: isEditTeamFormEnable() ? t('component.common.update.label') : t('component.common.save.label'),
        type: 'primary'
      }
    ]
  );

  const rules = {
    teamName: [
      {
        required: true,
        message: t('component.resource.team.teamName.isRequired')
      },
      {
        validator: (_, value) => spaceValidator(value)
      }
    ],
    teamDescription: [
      {
        required: true,
        message: t('component.resource.team.description.isRequired')
      },
      {
        validator: (_, value) => spaceValidator(value)
      }
    ],
    options: [
      {
        required: true,
        message: t('component.resource.team.resourceManager.isRequired')
      }
    ]
  };

  const fetchOptionLists = async () => {
    try {
      const resourceManagerRes = await UserService.getUsersByType(RESOURCE_MANAGER.key);
      const { data: resourceManagersList = [] } = resourceManagerRes;
      const filteredResourceManagers = isResourceManager
        ? resourceManagersList.filter(({ email }) => email === userName)
        : resourceManagersList;
      const resourceManagersOptionList = parseToOptionList(filteredResourceManagers);

      setResourceManagers(resourceManagersOptionList);

      if (isResourceManager) {
        form.setFieldValue('resourceManager1', [0].value);
      }
    } catch (error) {
      notification.error(error?.message);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchOptionLists();
    }
  }, [isModalOpen]);

  const resourceTeamForm = () => (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      name="resource-form"
      data-i="resource-team-form"
      onFieldsChange={() => {
        setIsFormTouched(true);
      }}>
      <Form.Item
        hidden
        data-i="form-item-id"
        name="id">
        <Input />
      </Form.Item>
      <Form.Item
        data-i="form-item-teamName"
        id="form-item-teamName"
        name="teamName"
        label={t('component.resource.team.table.column.teamName')}
        rules={rules.teamName}
        hasFeedback>
        <Input id="form-input-teamName" data-i="form-input-teamName" allowClear placeholder={t('component.resource.team.placeholder.name')} />
      </Form.Item>
      <Form.Item
        data-i="form-item-teamDescription"
        id="form-item-teamDescription"
        name="description"
        label={t('component.resource.team.label.description')}
        rules={rules.teamDescription}
        hasFeedback>
        <Input id="form-input-teamDescription" data-i="form-input-teamDescription" allowClear placeholder={t('component.resource.team.placeholder.description')} />
      </Form.Item>
      <Form.Item
        data-i="form-item-resourceManager1"
        id="form-item-resourceManager1"
        name="resourceManager1"
        label={t('component.resource.team.form.resourceManager1')}
        rules={rules.options}>
        <Select
          data-i="form-option-resourceManager1"
          id="form-option-resourceManager1"
          name="resourceManager1"
          allowClear
          showSearch
          loading={fromLoading}
          placeholder={t('component.resource.team.placeholder.selectResourceManager')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
          options={resourceManagers}
          disabled={isResourceManager}
          getPopupContainer={(trigger) => trigger.parentNode} />
      </Form.Item>
      <Form.Item
        data-i="form-option-resourceManager2"
        id="form-item-resourceManager2"
        name="resourceManager2"
        label={t('component.resource.team.form.resourceManager2')}>
        <Select
          data-i="form-option-resourceManager2"
          id="form-option-resourceManager2"
          name="resourceManager2"
          allowClear
          showSearch
          loading={fromLoading}
          placeholder={t('component.resource.team.placeholder.selectResourceManager')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
          options={resourceManagers}
          getPopupContainer={(trigger) => trigger.parentNode} />
      </Form.Item>
    </Form>
  );

  return (
    <Modal
      forceRender
      data-i="resource-team-form-modal"
      title={isEditTeamFormEnable() ? t('component.resource.team.editResourceTeam') : t('component.resource.team.addResourceTeam')}
      description={isEditTeamFormEnable() ? t('component.resource.team.enterDetails.of.existingResourceTeam') : t('component.resource.team.enterDetails.of.newResourceTeam')}
      isOpen={isModalOpen || isEditTeamFormEnable()}
      confirmOnCancel={isFormTouched}
      onCancel={onClose}
      footer={null}
      onOk={form.submit}
      secondaryActionsButtons={secondaryActionsButtons()}>
      {resourceTeamForm()}
    </Modal>
  );
}

ResourceTeamForm.defaultProps = {
  selectedTeam: {}
};
