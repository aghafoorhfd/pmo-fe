import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DatePicker,
  Col, Form, Row, Select, Button, Modal, notification, Input
} from 'antd';
import PropTypes from 'prop-types';
import { CloseOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getConfigurationOptions } from 'store/slices/projectDetailsSlice';
import { createOptionList } from 'utils/utils';
import { STATUS } from 'constants/StatusConstant';
import { getResourceTeamNames, hideMessage } from 'store/slices/resourceTeamSlice';
import { RESOURCE_CAPACITY_OPTIONS } from 'constants/DropdownOptions';
import { useNavigate } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import './styles.css';
import { SEVERITY_OPTIONS } from 'constants/MiscConstant';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import ProjectService from 'services/ProjectService';
import useFirstRender from 'utils/hooks/useFirstRender';
import moment from 'moment';

const { RangePicker } = DatePicker;

const EditableRequests = ({ form }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [projectStages, setProjectStages] = useState([]);

  const {
    configurationMetrics: { resourceDiscipline = [] },
    message,
    showMessage,
    status,
    selectedProjectDetails: { id: projectId }
  } = useSelector(({ projectDetails }) => (projectDetails));
  const isFirstRender = useFirstRender();

  useEffect(() => {
    dispatch(getConfigurationOptions());
  }, []);

  const getProjectStages = async () => {
    try {
      const { data: { stages = [] } = {} } = await ProjectService.getProjectTimeLine(projectId);
      setProjectStages(stages);
    } catch (err) {
      const { message: errMsg } = err;
      notification.error({ message: errMsg });
    }
  };

  useEffect(() => {
    if (projectId && !isFirstRender) {
      getProjectStages();
    }
  }, [projectId]);

  const notificationParam = {
    message
  };

  const startDateFiled = (index, data) => form.setFieldValue(['resourceRequestDetails', index, 'startDate'], moment(data?.startDate, DATE_FORMAT_DD_MM_YYYY));
  const endDateFiled = (index, data) => form.setFieldValue(['resourceRequestDetails', index, 'endDate'], moment(data?.endDate, DATE_FORMAT_DD_MM_YYYY));
  const rangePickerFiled = (index, data) => form.setFieldValue(['resourceRequestDetails', index, 'dateRange'], [
    moment(moment(data?.startDate, DATE_FORMAT_DD_MM_YYYY) || null, DATE_FORMAT_MM_DD_YYYY),
    moment(moment(data?.endDate, DATE_FORMAT_DD_MM_YYYY) || null, DATE_FORMAT_MM_DD_YYYY)]);

  const handleSelectChange = (value, index) => {
    const selectedDates = projectStages.filter((stage) => stage.stageName === value);
    const [data] = selectedDates;
    startDateFiled(index, data);
    endDateFiled(index, data);
    rangePickerFiled(index, data);
  };

  useEffect(() => {
    if (showMessage && status === STATUS.ERROR) {
      notification[status](notificationParam);
      dispatch(hideMessage());
    }
  }, [showMessage]);

  const disabledDate = (current, index) => {
    const startDate = form.getFieldValue(['resourceRequestDetails', index, 'startDate']);
    const endDate = form.getFieldValue(['resourceRequestDetails', index, 'endDate']);
    return current && (current < moment(startDate, DATE_FORMAT_MM_DD_YYYY) || current > moment(endDate, DATE_FORMAT_MM_DD_YYYY)) && !current.isSame(moment(endDate, DATE_FORMAT_MM_DD_YYYY), 'day');
  };

  return (
    <Form.List
      name="resourceRequestDetails"
      rules={[
        {
          validator: (_, resourceRequests) => {
            if (!resourceRequests || resourceRequests.length < 1) {
              return Promise.reject(new Error(t('component.project.manager.resources.form.validation.length.resourceRequest')));
            }
            return Promise.resolve();
          }
        }
      ]}>
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields?.map((field, index) => (
            <>
              {fields.length > 1 ? (
                <Row className="resource-req-cross-btn-cross-row">
                  <Col>
                    <Form.Item>
                      <Button
                        className="btn"
                        danger
                        shape="circle"
                        id={`resource-request-remove-btn-${index + 1}`}
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => remove(field.name)}
                        style={{
                          ...(index === 0 && {
                            marginTop: '25px', minWidth: '30px', width: '30px'
                          }),
                          height: '28px',
                          minWidth: '30px',
                          width: '30px'
                        }} />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}
              <Row gutter={[16, 4]} align="middle" justify="centre" key={field.key}>
                <Form.Item
                  name={[index, 'startDate']}>
                  <Input hidden />
                </Form.Item>
                <Form.Item
                  name={[index, 'endDate']}>
                  <Input hidden />
                </Form.Item>
                <Col span={5}>
                  <Form.Item
                    data-i="form-item-resource-stage"
                    name={[index, 'resourceStage']}
                    label={index === 0 ? t('component.project.manager.resources.form.label.resourceStage') : ''}
                    hasFeedback
                    rules={[{
                      required: true,
                      message: t('component.project.manager.resources.form.validation.resourceStage.message')
                    }]}>
                    <Select
                      showSearch
                      id={`resource-stage-${index + 1}`}
                      placeholder={t('component.project.manager.resources.form.placeholder.resourceStage')}
                      options={createOptionList(projectStages, 'stageName', 'stageName')}
                      onChange={(value) => handleSelectChange(value, index)} />
                  </Form.Item>
                </Col>

                <Col span={5}>
                  <Form.Item
                    data-i="form-item-resource-discipline"
                    name={[index, 'resourceDiscipline']}
                    label={index === 0 ? t('component.project.manager.resources.form.label.resourceDiscipline') : ''}
                    hasFeedback
                    rules={[{
                      required: true,
                      message: t('component.project.manager.resources.form.validation.resourceDiscipline.message')
                    }]}>
                    <Select
                      allowClear
                      showSearch
                      id={`resource-discipline-${index + 1}`}
                      placeholder={t('component.project.manager.resources.form.placeholder.resourceDiscipline')}
                      options={resourceDiscipline.map(
                        ({
                          name: disciplineName
                        }) => ({
                          value: disciplineName,
                          label: (
                            <div className="d-flex justify-content-between">
                              <span>{disciplineName}</span>
                            </div>)
                        })
                      )} />
                  </Form.Item>
                </Col>

                <Col span={4}>
                  <Form.Item
                    data-i="form-item-capacity"
                    name={[index, 'capacity']}
                    label={index === 0 ? t('component.project.manager.resources.form.label.capacity') : ''}
                    hasFeedback
                    rules={[{
                      required: true,
                      message: t('component.project.manager.resources.form.validation.capacity.message')
                    }]}>
                    <Select
                      allowClear
                      id={`resource-capacity-${index + 1}`}
                      placeholder={t('component.project.manager.resources.form.placeholder.capacity')}
                      options={RESOURCE_CAPACITY_OPTIONS} />
                  </Form.Item>
                </Col>

                <Col span={4}>
                  <Form.Item
                    data-i="form-item-priority"
                    name={[index, 'priority']}
                    label={index === 0 ? t('component.project.manager.resources.form.label.priority') : ''}
                    hasFeedback
                    rules={[{
                      required: true,
                      message: t('component.project.manager.resources.form.validation.priority.message')
                    }]}>
                    <Select
                      id={`resource-priority-${index + 1}`}
                      allowClear
                      placeholder={t('component.project.manager.resources.form.placeholder.priority')}
                      options={SEVERITY_OPTIONS} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    data-i="form-item-dateRange"
                    name={[index, 'dateRange']}
                    label={index === 0 ? t('component.project.manager.resources.form.label.dateRange') : ''}
                    hasFeedback
                    rules={[{
                      required: true,
                      message: t('component.project.manager.resources.form.validation.dateRange.message')
                    }]}>
                    <RangePicker
                      id={`resource-dateRange-${index + 1}`}
                      className="w-100"
                      format={DATE_FORMAT_MM_DD_YYYY}
                      disabledDate={(current) => disabledDate(current, index)} />
                  </Form.Item>
                </Col>
              </Row>
            </>
          ))}
          <Form.Item>
            <Button
              type="link"
              size="small"
              onClick={add}
              id="resource-request-add-more-btn"
              icon={<PlusOutlined />}>
              {t('component.project.manager.resources.form.addAnotherRequest')}
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>

        </>
      )}
    </Form.List>
  );
};

const RequestResourcesForm = ({
  form, handleSubmit, isLoading
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { confirm } = Modal;
  const [isFormTouched, setIsFormTouched] = useState(false);

  const {
    resourceTeamNames, showMessage,
    message,
    status
  } = useSelector(({ resourceTeam }) => (resourceTeam));

  const notificationParam = {
    message
  };

  useEffect(() => {
    if (showMessage && status === STATUS.ERROR) {
      notification[status](notificationParam);
      dispatch(hideMessage());
    }
  }, [showMessage]);

  useEffect(() => {
    dispatch(getResourceTeamNames());
  }, []);

  const showConfirm = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h5>{t('component.message.unsavedChanges')}</h5>,
      onOk() {
        navigate(`${APP_PREFIX_PATH}/dashboards/project-manager/project-resources-dashboard`);
      }
    });
  };

  const handleClose = () => {
    if (isFormTouched) {
      showConfirm();
    } else {
      navigate(`${APP_PREFIX_PATH}/dashboards/project-manager/project-resources-dashboard`);
    }
  };

  // Used to add 1 default empty resource request row
  const initialData = {
    resourceTeamId: undefined,
    resourceRequestDetails: [{
      resourceDiscipline: undefined,
      capacity: undefined,
      priority: undefined,
      dateRange: undefined
    }]
  };

  return (
    <Form
      data-i="request-resources-form"
      form={form}
      initialValues={initialData}
      onFinish={handleSubmit}
      disabled={isLoading}
      onFieldsChange={() => {
        setIsFormTouched(true);
      }}
      layout="vertical">
      <Row gutter={[16, 4]}>
        <Col span={6}>
          <Form.Item
            name="resourceTeamId"
            label={t('component.project.manager.resources.form.label.resourceTeam')}
            hasFeedback
            rules={[{
              required: true,
              message: t('component.project.manager.resources.form.validation.resourceTeam.message')
            }]}>
            <Select
              id="resource-field"
              allowClear
              showSearch
              placeholder={t('component.project.manager.resources.form.placeholder.resourceTeam')}
              options={createOptionList(resourceTeamNames, 'id', 'teamName')} />
          </Form.Item>
        </Col>
      </Row>
      <EditableRequests form={form} />

      <Row justify="end" gutter={6}>
        <Col span={3}>
          <Button block type="default" className="mr-2" onClick={handleClose}>
            {t('component.auth.cancel')}
          </Button>
        </Col>
        <Col span={3}>
          <Button block type="primary" htmlType="submit" className="mr-2">
            {t('component.project.manager.resources.column.label.sendRequest')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

RequestResourcesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default RequestResourcesForm;
