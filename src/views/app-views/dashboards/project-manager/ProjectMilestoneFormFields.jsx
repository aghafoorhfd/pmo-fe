import {
  DatePicker, Form, Select
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createOptionList } from 'utils/utils';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';

const ProjectMilestoneFormFields = ({ projectMilestones, milestones, currentDate }) => {
  const [milestoneSelected, setMilestoneSelected] = useState(false);
  const { t } = useTranslation();

  const filteredMilestones = projectMilestones?.filter(
    (milestone) => !milestones?.find((m) => m?.title === milestone?.name)
  );

  const disabledDate = (current) => current.isBefore(currentDate, 'day');

  return (
    <>
      <Form.Item
        data-i="form-item-project-timeline-milestone"
        name="milestone"
        label={t('component.project.manager.timelines.milestone')}
        rules={[{
          required: true,
          message: t('component.project.manager.project.details.validation.milestone.message')
        }]}
        hasFeedback>
        <Select
          id="milestone-dropdown"
          allowClear
          showSearch
          placeholder={t('component.project.manager.project.details.placeholder.milestone')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
          onChange={(text) => setMilestoneSelected(text)}
          options={createOptionList(filteredMilestones, 'name', 'name')}
          getPopupContainer={(trigger) => trigger.parentNode} />
      </Form.Item>

      {milestoneSelected && (
        <Form.Item
          data-i="form-item-project-timeline-milestone-endDate"
          name="endDate"
          label={t('component.project.manager.timelines.milestone.endDate')}
          rules={[{
            required: true
          }]}
          hasFeedback>
          <DatePicker
            className="w-100"
            allowClear
            placeholder={t('component.project.manager.timelines.milestone.endDate')}
            placement="bottomRight"
            id="project-timeline-milestone-endDate"
            format={DATE_FORMAT_MM_DD_YYYY}
            disabledDate={disabledDate}
            getPopupContainer={(trigger) => trigger.parentNode} />
        </Form.Item>
      )}
    </>
  );
};

export default ProjectMilestoneFormFields;
