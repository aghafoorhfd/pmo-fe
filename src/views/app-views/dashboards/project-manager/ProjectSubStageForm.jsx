import {
  DatePicker, Form, Select, notification
} from 'antd';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectService from 'services/ProjectService';
import { createOptionList } from 'utils/utils';

const ProjectSubStageForm = ({
  projectId, projectStages, form, stages
}) => {
  const { t } = useTranslation();
  const { RangePicker } = DatePicker;
  const [filteredOptions, setFilteredOptions] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const selectedStageName = Form.useWatch('stage');
  const filteredStages = stages?.filter(
    ({ name }) => projectStages?.find(
      ({ stageName }) => name === stageName?.props?.title
    )
  );

  const createStagesOption = () => {
    const filteredSubStages = selectedStage?.subStages
      ?.map((stage) => ({ name: stage?.subStageName }));

    return createOptionList(filteredSubStages, 'name', 'name');
  };

  const stagesOption = createStagesOption();

  const filterOption = (value) => (
    stagesOption?.filter((option) => option.value !== value)
  );

  const neglectSelectedOption = (value) => {
    setFilteredOptions(filterOption(value));
  };

  const getMetricsData = async () => {
    try {
      const { data: stageDetails } = await ProjectService.getStageDetails(
        projectId,
        selectedStageName
      );

      if (stageDetails?.subStages?.length > 1) {
        setSelectedStage(stageDetails);
      }
    } catch (err) {
      const { message } = err;
      notification.error({ message });
    }
  };

  useEffect(() => {
    if (selectedStageName) {
      form.setFieldsValue({
        isDependent: null,
        dependentOn: null
      });

      getMetricsData();
    }
  }, [projectId, selectedStageName]);

  const disabledDate = (current) => {
    const startDate = moment(selectedStage?.startDate, DATE_FORMAT_DD_MM_YYYY);
    const endDate = moment(selectedStage?.endDate, DATE_FORMAT_DD_MM_YYYY);
    return current && (current < startDate || current > endDate);
  };

  return (
    <>
      <Form.Item
        data-i="form-item-project-timeline-stage"
        name="stage"
        label={t('component.project.manager.timelines.selectStage')}
        rules={[
          {
            required: true,
            message: t('component.project.manager.resources.form.validation.stageName.message')
          }
        ]}
        hasFeedback>
        <Select
          getPopupContainer={(trigger) => trigger.parentElement}
          showSearch
          placeholder={t('component.project.manager.timelines.selectStage')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)
            || option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
          filterSort={(optionA, optionB) => (optionA?.label ?? '')
            .toLowerCase()
            .localeCompare((optionB?.label ?? '').toLowerCase())}
          options={createOptionList(filteredStages, 'name', 'name')}
          id="form-item-project-timeline-stage" />
      </Form.Item>
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
          placeholder={t('component.project.manager.timelines.subStage')}
          optionFilterProp="children"
          onChange={neglectSelectedOption}
          filterOption={(input, option) => (option?.label ?? '').includes(input)
            || option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
          options={stagesOption}
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
          placeholder={t('component.project.manager.timelines.subStage')}
          optionFilterProp="children"
          disabled={!filteredOptions}
          filterOption={(input, option) => (option?.label ?? '').includes(input)
            || option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
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
          format={DATE_FORMAT_MM_DD_YYYY}
          className="w-100"
          disabledDate={disabledDate}
          getPopupContainer={(trigger) => trigger.parentNode} />
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
            placeholder={t('component.project.manager.timelines.dependency.percentage')} />
        </Form.Item> */}
    </>
  );
};

export default ProjectSubStageForm;
