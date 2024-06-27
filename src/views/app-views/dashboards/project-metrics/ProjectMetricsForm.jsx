import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card,
  Form,
  DatePicker,
  Typography,
  Button,
  notification,
  Input
} from 'antd';
import { useTranslation } from 'react-i18next';
import ProjectService from 'services/ProjectService';
import moment from 'moment';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';
import { methodologyType } from 'constants/ProjectMetricsConstant';

const { Title } = Typography;

const ProjectMetricsForm = () => {
  const [form] = Form.useForm();
  const [isEditable, setIsEditable] = useState(false);

  const { t } = useTranslation();

  const handleSubmit = async (values) => {
    const data = { methodologyType: methodologyType.AGILE_SDLC, ...values };

    data.currentSprintStartDate = moment(data.currentSprintStartDate)
      .format(DATE_FORMAT_DD_MM_YYYY);
    data.fiscalYearStartDate = moment(data.fiscalYearStartDate)
      .format(DATE_FORMAT_DD_MM_YYYY);
    try {
      await ProjectService.saveProjectAgileDetails(data);
      setIsEditable(false);
      notification.success({ message: t('component.projectMetrics.form.submit.success') });
    } catch (error) {
      if (error.code === '9999') {
        notification.error({ message: t('component.projectMetrics.form.submit.error.9999') });
      } else {
        notification.error({ message: error.message });
      }
    }
  };

  const getProjectAgileDetails = async () => {
    try {
      const resp = await ProjectService.getProjectAgileDetails();
      if (resp && Object.keys(resp)?.length) {
        form.setFieldsValue({
          ...resp?.data,
          nextSprintStartDate: moment(
            resp?.data?.nextSprintStartDate,
            DATE_FORMAT_DD_MM_YYYY
          ),
          currentSprintStartDate: moment(
            resp?.data?.currentSprintStartDate,
            DATE_FORMAT_DD_MM_YYYY
          ),
          fiscalYearStartDate: moment(resp?.data?.fiscalYearStartDate, DATE_FORMAT_DD_MM_YYYY)
        });
      } else {
        setIsEditable(true);
      }
    } catch (err) {
      notification.error({ message: err.message });
    }
  };

  useEffect(() => {
    getProjectAgileDetails();
  }, []);

  const isNotInLast3Months = (current) => moment().diff(current, 'days') > 90;

  const aglieFields = () => (
    <Row gutter={[16, 4]}>
      <Col span={24}>
        <Title strong level={3}>{t('component.projectMetrics.form.agile')}</Title>
      </Col>
      <Col lg={8} md={12} xs={24}>
        <Form.Item
          data-i="sprint-duration"
          name="sprintDuration"
          label={t('component.projectMetrics.form.label.sprintDuration')}
          rules={[
            {
              required: true
            },
            () => ({
              validator(_, value) {
                if (value < 10 || value > 30) {
                  return Promise.reject(new Error(t('component.projectMetrics.form.validation.sprintDuration')));
                }
                return Promise.resolve();
              }
            })
          ]}>
          <Input
            type="number"
            min={5}
            max={60}
            style={{ width: '100%' }}
            placeholder={t('component.projectMetrics.form.placeholder.sprintDuration')} />
        </Form.Item>
      </Col>

      <Col lg={8} md={12} xs={24}>
        <Form.Item
          data-i="sprint-name"
          name="currentSprintName"
          label={t('component.projectMetrics.form.label.currentSprintName')}
          rules={[
            {
              required: true
            },
            () => ({
              validator(_, value) {
                if (value < 0 || value > 10000) {
                  return Promise.reject(new Error(t('component.projectMetrics.form.validation.currentSprintName')));
                }
                return Promise.resolve();
              }
            })
          ]}>
          <Input
            type="number"
            min={0}
            max={10000}
            style={{ width: '100%' }}
            placeholder={t('component.projectMetrics.form.placeholder.currentSprintName')} />
        </Form.Item>
      </Col>

      <Col lg={8} md={12} xs={24}>
        <Form.Item
          name="currentSprintStartDate"
          label={t('component.projectMetrics.form.label.currentSprintStartDate')}
          rules={[
            {
              required: true
            }
          ]}>
          <DatePicker
            className="w-100"
            placeholder={t('component.projectMetrics.form.placeholder.date')}
            disabledDate={isNotInLast3Months} />
        </Form.Item>
      </Col>
    </Row>
  );

  const sdlcFields = () => (
    <Row gutter={[16, 4]}>
      <Col span={24}>
        <Title strong level={3}>{t('component.projectMetrics.form.sdlc')}</Title>
      </Col>
      <Col lg={8} md={12} xs={24}>
        <Form.Item
          name="fiscalYearStartDate"
          label={t('component.projectMetrics.form.label.startOfFiscalYear')}
          rules={[
            {
              required: true
            }
          ]}>
          <DatePicker
            className="w-100"
            placeholder={t('component.projectMetrics.form.placeholder.date')}
            disabledDate={isNotInLast3Months} />
        </Form.Item>
      </Col>
    </Row>
  );

  return (
    <Card style={{ boxShadow: '0 0 5px #e2e1e1' }}>
      <Form
        form={form}
        name="project-metrics"
        data-i="metrics-form"
        onFinish={handleSubmit}
        layout="vertical"
        disabled={!isEditable}>
        {aglieFields()}
        {sdlcFields()}
        {
          isEditable && (
            <Row justify="end">
              <Button type="primary" htmlType="submit" className="mr-2">
                {t('component.common.save.label')}
              </Button>
            </Row>
          )
        }
      </Form>
    </Card>
  );
};

export default ProjectMetricsForm;
