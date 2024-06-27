import {
  DatePicker, Form, Select
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createOptionList } from 'utils/utils';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';

const ProjectDependencyFormFields = ({ projectStages }) => {
  const { t } = useTranslation();
  const { RangePicker } = DatePicker;

  const [filteredOptions, setFilteredOptions] = useState(null);

  const filteredProjectStages = projectStages?.filter((stage) => !stage.project)?.map(
    (stage) => ({ name: stage?.stageName?.props?.title || stage?.id })
  );

  const stagesOption = createOptionList(filteredProjectStages, 'name', 'name');

  const [filterStagesOption, setFilterStagesOption] = useState(stagesOption);

  const filterOption = (value) => (
    stagesOption?.filter((option) => option.value !== value)
  );

  const neglectSelectedOption = (value) => {
    setFilteredOptions(filterOption(value));
  };

  const neglectSelectedFilteredOptions = (value) => {
    const filteredStages = stagesOption?.filter((option) => option?.value !== value);
    setFilterStagesOption(filteredStages);
  };

  return (
    <>
      <Form.Item
        data-i="form-item-project-timeline-dependency-isDependent"
        name="isDependent"
        label={t('component.project.manager.timelines.dependency.isDependent')}
        rules={[{
          required: true
        }]}
        hasFeedback>
        <Select
          allowClear
          showSearch
          placeholder={t('component.project.manager.timelines.dependency.selectStage')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)
            || option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
          filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
          onChange={neglectSelectedOption}
          options={filterStagesOption}
          getPopupContainer={(trigger) => trigger.parentNode} />
      </Form.Item>
      <Form.Item
        data-i="form-item-project-timeline-dependency-dependentOn"
        name="dependentOn"
        label={t('component.project.manager.timelines.dependency.dependentOn')}
        rules={[{
          required: true
        }]}
        hasFeedback>
        <Select
          allowClear
          showSearch
          disabled={!filteredOptions}
          placeholder={t('component.project.manager.timelines.dependency.selectStage')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)
            || option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
          filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
          onChange={neglectSelectedFilteredOptions}
          id="project-timeline-dependency-dependentOn"
          options={filteredOptions}
          getPopupContainer={(trigger) => trigger.parentNode} />
      </Form.Item>

      <Form.Item
        name="stageDateRange"
        label={t('component.project.manager.timelines.dependency.date')}
        data-i="form-item-project-timeline-dependency-date"
        rules={[{
          required: true
        }]}
        hasFeedback>
        <RangePicker
          getPopupContainer={(trigger) => trigger.parentNode}
          format={DATE_FORMAT_MM_DD_YYYY}
          className="w-100"
          id="project-timeline-dependency-date" />
      </Form.Item>
      {/* This code will be uncommented once we receive an update from the client. */}
      {/* <Form.Item
        data-i="form-item-project-timeline-dependency-percentage"
        name="percentage"
        label={t('component.project.manager.timelines.dependency.percentage')}
        rules={[
          {
            required: true
          },
          () => ({
            validator(_, value) {
              if (value < 0 || value > 100) {
                return Promise.reject(
                  new Error(
                    t('component.project.manager.timelines.dependency.percentage.error.message')
                  )
                );
              }
              return Promise.resolve();
            }
          })
        ]}>
        <InputNumber
          className="w-100"
          allowClear
          addonAfter="%"
          id="project-timeline-dependency-percentage"
          placeholder={t('component.project.manager.timelines.dependency.percentage')} />
      </Form.Item> */}
    </>
  );
};

export default ProjectDependencyFormFields;
