import React, { useEffect, useState } from 'react';
import Modal from 'components/shared-components/Modal';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Checkbox, Form, Input, Select
} from 'antd';
import { getConfigurationOptions } from 'store/slices/projectDetailsSlice';
import { createOptionList } from 'utils/utils';
import { JIRA_WORK_TYPE } from 'constants/DropdownOptions';
import { addJiraItem } from 'store/slices/jiraSlice';
import { STATUS } from 'constants/StatusConstant';
import { REGEX } from 'constants/RegexConstant';

const AddJiraItemForm = ({
  isFormVisible, setFormVisibility, projectId, tasks
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [jiraType, setJiraType] = useState('');
  const [USER_STORY, , INITIATIVE] = JIRA_WORK_TYPE;

  const [form] = Form.useForm();
  // TODOS: Commenting this subStages code because sub stages work in not working for now.
  // Will be uncommenting this code once the backend implements this

  // const projectStage = Form.useWatch('projectStage', form);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const handleJiraTypeChange = (value) => {
    setJiraType(value);
    form.setFieldsValue({ isPullChildIssues: value === INITIATIVE.value });
  };

  const {
    projectDetails: { configurationMetrics },
    jira: {
      message, showMessage, status, loading
    }
  } = useSelector(({ projectDetails, jira }) => ({ projectDetails, jira }));
  // TODOS: Commenting this subStages code because sub stages work in not working for now.
  // Will be uncommenting this code once the backend implements this
  // Import this findBy from utils File.

  // const subStages =
  // findBy('name', projectStage, configurationMetrics?.projectStages)?.subStages || [];

  useEffect(() => {
    if (!configurationMetrics || Object.keys(configurationMetrics)?.length <= 0) {
      dispatch(getConfigurationOptions());
    }
  }, []);

  const handleCancel = () => {
    form.resetFields();
    setFormVisibility(false);
    setIsFormTouched(false);
  };

  useEffect(() => {
    if (showMessage && status === STATUS.SUCCESS && message === t('component.jira.add.item.success')) {
      handleCancel();
    }
  }, [showMessage]);

  const stageslist = configurationMetrics?.projectStages?.filter(({ name }) => tasks?.find(
    ({ id: stageName }) => stageName === name
  ))?.map(
    ({ name, subStages: subFields }) => (
      { name, subStages: subFields }
    )
  );

  const secondaryActionsButtons = () => (
    [
      {
        action: 'close',
        block: true,
        colSpan: 12,
        label: t('component.auth.cancel'),
        type: 'default'
      },
      {
        disable: loading,
        action: form.submit,
        block: true,
        colSpan: 12,
        label: t('component.jira.form.ok'),
        type: 'primary'
      }
    ]
  );

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(addJiraItem({ projectId, values }));
      })
      .catch((info) => {
        throw info;
      });
  };

  const formContent = () => (
    <Form
      initialValues={{
        isPullChildIssues: false
      }}
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      name="user-modal-form"
      data-i="user-form"
      onFieldsChange={() => {
        setIsFormTouched(true);
      }}>

      <Form.Item
        data-i="form-item-workType"
        name="jiraWorkType"
        label={t('component.jira.form.label.jiraWorkType')}
        rules={[
          {
            required: true,
            message: t('component.jira.form.validation.jiraWorkType')
          }
        ]}
        hasFeedback>
        <Select
          name="jiraWorkType"
          data-i="form-item-accessType-inputField"
          allowClear
          showSearch
          value={jiraType}
          onChange={handleJiraTypeChange}
          placeholder={t('component.jira.form.placeHolder.jiraWorkType')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) => (optionA?.label ?? '')
            .toLowerCase()
            .localeCompare((optionB?.label ?? '').toLowerCase())}
          options={JIRA_WORK_TYPE} />
      </Form.Item>

      <Form.Item
        data-i="form-item-workName"
        name="workName"
        label={t('component.jira.form.label.jiraWorkName')}
        rules={[
          {
            required: true,
            message: t('component.jira.form.validation.jiraWorkName')
          },
          {

            pattern: REGEX.TICKET_REGEX,
            message: t('component.jira.form.validation.jiraWorkName.validation')

          }
        ]}
        hasFeedback>
        <Input
          data-i="form-item-workName"
          allowClear
          placeholder={t('component.jira.form.placeHolder.jiraWorkName')} />
      </Form.Item>

      <Form.Item
        data-i="form-item-pullChildStories"
        valuePropName="checked"
        name="isPullChildIssues">
        <Checkbox
          disabled={jiraType === INITIATIVE.value || jiraType === USER_STORY.value}
          data-i="form-item-pullChildStories">
          {t('component.jira.form.label.pullChildStories')}
        </Checkbox>
      </Form.Item>

      <Form.Item
        data-i="form-item-projectStage"
        name="projectStage"
        label={t('component.jira.form.label.projectStage')}
        rules={[
          {
            required: true,
            message: t('component.jira.form.validation.projectStage')
          }
        ]}
        hasFeedback>
        <Select
          name="projectStage"
          data-i="form-item-accessType-inputField"
          allowClear
          showSearch
          placeholder={t('component.jira.form.placeHolder.projectStage')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) => (optionA?.label ?? '')
            .toLowerCase()
            .localeCompare((optionB?.label ?? '').toLowerCase())}
          options={createOptionList(stageslist, 'name', 'name')} />
      </Form.Item>
      {/* TODOS: Commenting this subStages code because sub stages work in not working for now.
      Will be uncommenting this code once the backend implements this
      <Form.Item
        data-i="form-item-projectSubStage"
        name="projectSubStage"
        label={t('component.jira.form.label.projectSubStage')}
        hasFeedback>
        <Select
          name="projectSubStage"
          data-i="form-item-accessType-inputField"
          allowClear
          showSearch
          placeholder={t('component.jira.form.placeHolder.projectSubStage')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) => (optionA?.label ?? '')
            .toLowerCase()
            .localeCompare((optionB?.label ?? '').toLowerCase())}
          options={createOptionList(subStages, 'name', 'name')} />
      </Form.Item> */}
    </Form>
  );
  return (
    <Modal
      destroyOnClose
      data-i="user-form-modal"
      confirmOnCancel={isFormTouched}
      open={isFormVisible}
      title={t('component.jira.form.title')}
      description={t('component.jira.form.description')}
      onOk={form.submit}
      onCancel={handleCancel}
      footer={null}
      secondaryActionsButtons={secondaryActionsButtons()}>
      {formContent()}
    </Modal>
  );
};

export default AddJiraItemForm;
