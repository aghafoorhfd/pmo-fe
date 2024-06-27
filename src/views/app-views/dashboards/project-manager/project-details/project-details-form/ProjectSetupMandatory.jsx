import React, { useEffect, useState } from 'react';
import {
  Form, Input, Row, Col, Select, Typography
} from 'antd';
import { Card } from 'components/shared-components/Card';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { createOptionList, spaceValidator } from 'utils/utils';
import './project-details.css';
import { useSearchParams } from 'react-router-dom';
import { Segments } from 'components/shared-components/Segment';
import { PROJECT_CADENCE } from 'constants/ProjectDetailsConstant';
import ToolTip from 'components/shared-components/Tooltip';
import { QuestionCircleFilled } from '@ant-design/icons';
import ProjectSetupOptional from './ProjectSetupOptional';

const ACTIVE = 'Active';
const UN_COMMIT = 'Un-Commit';
const OUTLOOK_REASON = {};
const OUTLOOK_COLOR = {};
const defaultOutlook = 'Green';

const ProjectSetupMandatory = ({
  form, projectId, projectStarted, isFormAccessable
}) => {
  const { t } = useTranslation();

  const {
    projectDetails: {
      configurationMetrics,
      projectCadence: { agile: agileDetails, sdlc: sdlcDetails }
    }
  } = useSelector(({ projectDetails }) => (
    { projectDetails }
  ));
  const [projectStatesOptions, setProjectStatesOptions] = useState([]);
  const [cadenceOptions, setCadenceOptions] = useState(createOptionList(PROJECT_CADENCE));
  const [projectStatusOptions, setProjectStatusOptions] = useState([]);
  const [, setSearchParams] = useSearchParams();

  const outlook = Form.useWatch('outlook', form);
  const currentStatus = Form.useWatch('currentStatus', form);

  useEffect(() => {
    if (configurationMetrics?.projectOutlook?.length > 0) {
      configurationMetrics?.projectOutlook?.forEach(({ name, description, code }) => {
        OUTLOOK_REASON[name] = description;
        OUTLOOK_COLOR[name] = code;
      });
    }
  }, [configurationMetrics?.projectOutlook]);

  useEffect(() => {
    if (!projectId) {
      form?.setFieldsValue({
        outlookReason: OUTLOOK_REASON[outlook], outlook: defaultOutlook, currentState: UN_COMMIT
      });
    }
  }, []);

  useEffect(() => {
    if (outlook) {
      form?.setFieldsValue({
        outlookReason: OUTLOOK_REASON[outlook],
        outlookCode: OUTLOOK_COLOR[outlook]
      });
    }
  }, [outlook, configurationMetrics?.projectOutlook]);

  useEffect(() => {
    const projectStates = createOptionList(configurationMetrics?.projectStates, 'name', 'name')
      .map((item) => ({ ...item, disabled: item.label === UN_COMMIT && currentStatus === ACTIVE }));
    setProjectStatesOptions(projectStates);

    if (currentStatus === ACTIVE && form.getFieldValue('currentState') === UN_COMMIT) {
      form?.setFieldsValue({ currentState: '' });
    }
  }, [currentStatus, configurationMetrics?.projectStates]);

  useEffect(() => {
    const data = { AGILE: !!agileDetails, SDLC: !!sdlcDetails };
    setCadenceOptions(cadenceOptions.map((option) => {
      if (!data[option.label]) {
        return { ...option, disabled: true };
      }
      return option;
    }));
  }, [agileDetails, sdlcDetails]);
  useEffect(() => {
    const projectStatus = createOptionList(configurationMetrics?.projectStatus, 'name', 'name')
      .map((item) => ({ ...item, disabled: !projectId && item.value === ACTIVE }));
    setProjectStatusOptions(projectStatus);
  }, [projectId, configurationMetrics?.projectStatus]);

  const outLookOptions = createOptionList(configurationMetrics?.projectOutlook, 'name', 'name');
  const onCadenceChange = (e) => {
    setSearchParams({ cadenceType: e });
  };

  return (
    <Card className="card-container" data-i="project-info-section">
      <Row className="title-row">
        <Col>
          <Typography.Title level={4}>{t('component.project.manager.project.details.modal.title')}</Typography.Title>
        </Col>
      </Row>
      <Row gutter={[16, 4]}>
        <Col span={8}>
          <Form.Item
            data-i="form-item-cadence"
            name="projectCadence"
            label={t('component.project.manager.project.details.label.cadence')}
            rules={[{
              required: true,
              message: t('component.project.manager.project.details.validation.cadence.message')
            }]}
            hasFeedback>
            <Segments
              options={cadenceOptions}
              onChange={onCadenceChange}
              disabled={isFormAccessable || projectStarted}
              id="form-item-cadence-field" />
          </Form.Item>
        </Col>
        <Col lg={8} md={24} xs={24}>
          <Form.Item
            data-i="form-item-currentStatus"
            name="currentStatus"
            label={t('component.project.manager.project.details.label.currentStatus')}
            hasFeedback>
            <Segments
              disabled={isFormAccessable}
              options={projectStatusOptions} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 4]}>
        <Col lg={8} md={12} xs={24}>
          <Form.Item
            data-i="form-item-projectName"
            name="projectName"
            label={(
              <>
                { t('component.project.manager.project.details.label.projectName')}
                <ToolTip
                  className="cursor-pointer ml-2"
                  title={t('component.project.manager.project.details.label.projectName.helperText')}
                  icon={<QuestionCircleFilled />} />
              </>
            )}
            rules={[
              { required: true },
              {
                validator: (_, value) => spaceValidator(value)
              }]}
            hasFeedback>
            <Input
              className="input-fields"
              id="form-item-projectName-inputField"
              allowClear
              placeholder={t('component.project.manager.project.details.placeholder.projectName')} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} xs={24}>
          <Form.Item
            data-i="form-item-projectNumber"
            name="projectNumber"
            label={(
              <>
                {t('component.project.manager.project.details.label.projectNumber')}
                <ToolTip
                  className="cursor-pointer ml-2"
                  title={t('component.project.manager.project.details.label.projectNumber.helperText')}
                  icon={<QuestionCircleFilled />} />
              </>
            )}
            rules={[{ required: true },
              {
                validator: (_, value) => spaceValidator(value)
              }]}
            hasFeedback>
            <Input
              className="input-fields"
              id="form-item-projectNumber-inputField"
              allowClear
              disabled
              placeholder={t('component.project.manager.project.details.placeholder.projectNumber')} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} xs={24}>
          <Form.Item
            data-i="form-item-overview"
            name="overview"
            label={(
              <>
                { t('component.project.manager.project.details.label.overview')}
                <ToolTip
                  className="cursor-pointer ml-2"
                  title={t('component.project.manager.project.details.label.overview.helperText')}
                  icon={<QuestionCircleFilled />} />
              </>
              )}
            rules={[
              { required: true },
              {
                validator: (_, value) => spaceValidator(value)
              }]}
            hasFeedback>
            <Input
              className="input-fields"
              id="form-item-overview-inputField"
              allowClear
              placeholder={t('component.project.manager.project.details.placeholder.overview')} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} xs={24}>
          <Form.Item
            data-i="form-item-priority"
            name="priority"
            label={(
              <>
                { t('component.project.manager.project.details.label.priority')}
                <ToolTip
                  className="cursor-pointer ml-2"
                  title={t('component.project.manager.project.details.label.priority.helperText')}
                  icon={<QuestionCircleFilled />} />
              </>
            )}
            rules={[{
              required: true,
              message: t('component.project.manager.project.details.validation.priority.message')
            }]}
            hasFeedback>
            <Select
              className="input-fields"
              id="form-item-priority-inputField"
              allowClear
              showSearch
              placeholder={t('component.project.manager.project.details.placeholder.priority')}
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
              options={createOptionList(configurationMetrics?.projectPriorityLevel, 'name', 'name')}
              getPopupContainer={(trigger) => trigger.parentNode} />
          </Form.Item>
        </Col>
        <Col lg={8} md={24} xs={24}>
          <Form.Item
            help={(
              <span style={{ color: OUTLOOK_COLOR[outlook] }}>
                {OUTLOOK_REASON[outlook]?.length
                  ? t('component.project.manager.project.details.validation.outlook.reason.message', { reason: OUTLOOK_REASON[outlook] })
                  : t('component.project.manager.project.details.validation.outlook.message')}
              </span>
            )}
            data-i="form-item-outlook"
            name="outlook"
            label={t('component.project.manager.project.details.label.outlook')}
            rules={[{
              required: true,
              message: t('component.project.manager.project.details.validation.outlook.message')
            }]}
            hasFeedback>
            <Select
              style={{ color: OUTLOOK_COLOR[outlook] }}
              id="form-item-outlook-inputField"
              allowClear
              showSearch
              placeholder={t('component.project.manager.project.details.placeholder.outlook')}
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
              options={outLookOptions}
              className="input-fields"
              getPopupContainer={(trigger) => trigger.parentNode} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} xs={24}>
          <Form.Item
            data-i="form-item-currentState"
            name="currentState"
            label={t('component.project.manager.project.details.label.currentState')}
            rules={[{
              required: true,
              message: t('component.project.manager.project.details.validation.state.message')
            }]}
            hasFeedback>
            <Select
              className="input-fields"
              id="form-item-currentState-inputField"
              allowClear
              showSearch
              placeholder={t('component.project.manager.project.details.placeholder.currentState')}
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
              options={projectStatesOptions}
              getPopupContainer={(trigger) => trigger.parentNode}
              disabled={!projectId} />
          </Form.Item>
        </Col>
      </Row>
      <ProjectSetupOptional />
    </Card>
  );
};

export default ProjectSetupMandatory;
