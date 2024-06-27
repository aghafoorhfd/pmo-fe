import React, { useEffect } from 'react';
import {
  Form, Input, Row, Col, Select
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createOptionList, spaceValidator } from 'utils/utils';
import './project-details.css';
import ToolTip from 'components/shared-components/Tooltip';
import { QuestionCircleFilled } from '@ant-design/icons';
import { getActiveSubscription } from 'store/slices/subscriptionSlice';
import { BILLING_OPTIONS } from 'constants/MiscConstant';

const ProjectSetupOptional = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { FREE } = BILLING_OPTIONS;

  const {
    projectDetails: {
      configurationMetrics
    },
    subscription: { activeSubscription: { planPaymentCycle } = {} } = {}
  } = useSelector((state) => ({
    projectDetails: state.projectDetails,
    subscription: state.subscription
  }
  ));

  useEffect(() => {
    dispatch(getActiveSubscription());
  }, []);

  return (

    <Row gutter={[16, 4]}>
      <Col lg={8} md={12} xs={24}>
        <Form.Item
          data-i="form-item-projectJiraKey"
          name="projectKey"
          rules={[
            {
              validator: (_, value) => spaceValidator(value)
            }]}
          label={(
            <>
              {t('component.project.manager.project.details.label.jiraProjectKey')}
              <ToolTip
                className="cursor-pointer ml-2"
                title={t('component.project.manager.project.details.placeholder.jiraProjectKey.helperText')}
                icon={<QuestionCircleFilled />} />
              <span className="pl-2 text-danger">{planPaymentCycle === FREE && t('component.project.manager.project.details.placeholder.jiraProjectKey.free.Lock.helperText')}</span>
            </>
          )}
          hasFeedback>
          <Input
            disabled={planPaymentCycle === FREE}
            className="input-fields"
            id="form-item-projectKey-inputField"
            allowClear
            placeholder={t('component.project.manager.project.details.placeholder.jiraProjectKey')} />
        </Form.Item>
      </Col>
      <Col lg={8} md={12} xs={24}>
        <Form.Item
          data-i="form-item-category"
          name="category"
          label={(
            <>
              {t('component.project.manager.project.details.label.category')}
              <ToolTip
                className="cursor-pointer ml-2"
                title={t('component.project.manager.project.details.label.category.helperText')}
                icon={<QuestionCircleFilled />} />
            </>
            )}
          hasFeedback>
          <Select
            size="large"
            className="input-fields"
            id="form-item-category-inputField"
            allowClear
            showSearch
            placeholder={t('component.project.manager.project.details.placeholder.category')}
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
            options={createOptionList(configurationMetrics?.projectCategory, 'name', 'name')}
            getPopupContainer={(trigger) => trigger.parentElement} />
        </Form.Item>

      </Col>
      <Col lg={8} md={12} xs={24}>
        <Form.Item
          data-i="form-item-department"
          name="department"
          label={(
            <>
              { t('component.project.manager.project.details.label.department')}
              <ToolTip
                className="cursor-pointer ml-2"
                title={t('component.project.manager.project.details.label.department.helperText')}
                icon={<QuestionCircleFilled />} />
            </>
          )}
          hasFeedback>
          <Select
            className="input-fields"
            id="form-item-department-inputField"
            allowClear
            showSearch
            placeholder={t('component.project.manager.project.details.placeholder.department')}
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
            options={createOptionList(configurationMetrics?.sponsoringDepartment, 'name', 'name')}
            getPopupContainer={(trigger) => trigger.parentElement} />
        </Form.Item>
      </Col>
      <Col lg={8} md={12} xs={24}>
        <Form.Item
          data-i="form-item-theme"
          name="theme"
          label={(
            <>
              { t('component.project.manager.project.details.label.theme')}
              <ToolTip
                className="cursor-pointer ml-2"
                title={t('component.project.manager.project.details.label.theme.helperText')}
                icon={<QuestionCircleFilled />} />
            </>
          )}
          rules={[
            {
              validator: (_, value) => spaceValidator(value)
            }]}
          hasFeedback>
          <Input
            className="input-fields"
            id="form-item-theme-inputField"
            allowClear
            placeholder={t('component.project.manager.project.details.placeholder.theme')} />
        </Form.Item>
      </Col>
      <Col span={0}>
        <Form.Item
          hidden
          data-i="form-item-outlookReason"
          name="outlookReason"
          label={t('component.project.manager.project.details.label.outlookReason')}
          hasFeedback>
          <Input
            id="form-item-outlookReason-inputField"
            disabled
            placeholder={t('component.project.manager.project.details.placeholder.outlookReason')} />
        </Form.Item>
      </Col>
      <Col span={0}>
        <Form.Item
          hidden
          data-i="form-item-outlookCode"
          name="outlookCode"
          label={t('component.project.manager.project.details.label.outlookCode')}
          hasFeedback>
          <Input
            id="form-item-outlookCode-inputField"
            disabled
            placeholder={t('component.project.manager.project.details.placeholder.outlookCode')} />
        </Form.Item>
      </Col>
      <Col lg={8} md={12} xs={24}>
        <Form.Item
          data-i="form-item-currentStage"
          name="currentStage"
          label={t('component.project.manager.project.details.label.currentStage')}
          hasFeedback>
          <Select
            className="input-fields"
            id="form-item-currentStage-inputField"
            allowClear
            showSearch
            placeholder={t('component.project.manager.project.details.placeholder.currentStage')}
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
            options={createOptionList(configurationMetrics?.projectStages, 'name', 'name')}
            getPopupContainer={(trigger) => trigger.parentElement} />
        </Form.Item>
      </Col>
    </Row>

  );
};

export default ProjectSetupOptional;
