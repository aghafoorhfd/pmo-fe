import {
  DatePicker, Form, Select, notification, Modal as AntModal
} from 'antd';
import Modal from 'components/shared-components/Modal';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import { MILESTONES_STATUS, PROJECT_METRICS } from 'constants/MiscConstant';
import moment from 'moment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectService from 'services/ProjectService';
import PropTypes from 'prop-types';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = AntModal;

const ProjectMilestoneModal = ({
  milestone, projectId, onCancel, onSuccess, disabled = false
}) => {
  const [checkForms, setCheckForm] = useState(false);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const isModalOpen = milestone !== null;
  const { title } = milestone;

  const handleSubmit = async () => {
    try {
      const { metricStatus, endDate } = form.getFieldsValue();
      const payload = {
        metricStatus,
        metricName: milestone.title,
        metricType: PROJECT_METRICS.MILESTONES,
        endDate: endDate.format(DATE_FORMAT_DD_MM_YYYY)
      };
      await ProjectService.updateMilestone(projectId, payload);
      notification.success({ message: t('component.project.manager.timelines.milestone.success.message') });
      onSuccess();
      onCancel();
    } catch (err) {
      notification.error({ message: err?.message });
    }
  };

  const removeHandler = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h5>{t('component.project.milestone.remove.confirmation')}</h5>,
      async onOk() {
        await ProjectService.deleteMetric(
          projectId,
          PROJECT_METRICS.MILESTONES,
          title
        );
        notification.success({ message: t('component.project.manager.timelines.milestone.delete.success.message') });
        onSuccess();
        onCancel();
      }
    });
  };

  return (
    <Modal
      forceRender
      title={title}
      open={isModalOpen}
      onCancel={onCancel}
      confirmOnCancel={checkForms}
      footer={null}
      okButtonProps={{ disabled }}
      secondaryActionsButtons={[
        {
          action: onCancel,
          block: true,
          colSpan: 8,
          label: t('component.conflict.manager.button.close'),
          type: 'primary'
        },
        {
          action: form.submit,
          block: true,
          colSpan: 8,
          label: t('component.common.update.label'),
          type: 'default',
          disable: disabled
        },
        {
          action: removeHandler,
          block: true,
          colSpan: 8,
          label: t('component.common.edit.remove.label'),
          type: 'default',
          disable: disabled
        }]}>
      <Form
        form={form}
        disabled={disabled}
        name="project-milestone-form"
        data-i="project-milestone-form"
        onFinish={handleSubmit}
        layout="vertical"
        onFieldsChange={() => {
          setCheckForm(true);
        }}
        initialValues={{
          metricStatus: milestone.status,
          startDate: moment(
            milestone.startDate,
            DATE_FORMAT_MM_DD_YYYY
          ),
          endDate: moment(
            milestone.endDate,
            DATE_FORMAT_MM_DD_YYYY
          )
        }}>
        <Form.Item
          name="endDate"
          label={t('component.project.manager.timelines.milestone.endDate')}
          rules={[
            {
              required: true
            }
          ]}>
          <DatePicker
            disabled
            className="w-100"
            format={DATE_FORMAT_MM_DD_YYYY} />
        </Form.Item>

        <Form.Item
          name="metricStatus"
          label={t('component.project.manager.timelines.milestone.status.label')}
          rules={[{
            required: true
          }]}>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}>
            {
              Object.keys(MILESTONES_STATUS).map((status) => (
                <Select.Option value={status} key={status}>
                  {MILESTONES_STATUS[status].value}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

ProjectMilestoneModal.propTypes = {
  milestone: PropTypes.shape({}).isRequired,
  projectId: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

ProjectMilestoneModal.defaultProps = {
  disabled: false
};

export default ProjectMilestoneModal;
