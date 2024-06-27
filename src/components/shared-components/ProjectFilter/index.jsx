import { Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import Filters from 'components/common/filters/Filters';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getConfigurationOptions } from 'store/slices/projectDetailsSlice';
import useFilter from 'utils/hooks/useFilter';
import { createOptionList } from 'utils/utils';
import PropTypes from 'prop-types';

const ProjectFilter = ({ onApplyFilter, onClearFilter }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { configurationMetrics } = useSelector(({ projectDetails }) => (projectDetails));
  const [appliedFilters] = useFilter('ProjectFilter');

  useEffect(() => {
    if (!configurationMetrics || Object.keys(configurationMetrics)?.length <= 0) {
      dispatch(getConfigurationOptions());
    }
  }, []);

  const handleSearch = () => {
    onApplyFilter(appliedFilters?.uri);
  };
  const handleClear = () => {
    onClearFilter();
  };

  return (
    <Filters
      title={t('component.common.project.button.filters')}
      placement="bottomRight"
      name="ProjectFilter"
      onSearch={handleSearch}
      onClear={handleClear}
      formItems={[
        {
          name: 'projectName',
          label: t('component.common.project.label.projectName'),
          colSpan: 12,
          render: () => (
            <Input
              allowClear
              prefix={<SearchOutlined className="mr-0" />}
              placeholder={t('component.common.project.label.projectName')}
              id="project-name-filter" />
          )
        },
        {
          name: 'category',
          label: t('component.common.project.label.projectCategory'),
          colSpan: 12,
          render: () => (
            <Select
              allowClear
              showSearch
              showArrow
              options={createOptionList(configurationMetrics?.projectCategory, 'name', 'name')}
              placeholder={t('component.common.project.label.projectCategory')}
              id="project-category-filter" />
          )
        },
        {
          name: 'priority',
          label: t('component.common.project.label.projectPriority'),
          colSpan: 12,
          render: () => (
            <Select
              allowClear
              showSearch
              showArrow
              options={createOptionList(configurationMetrics?.projectPriorityLevel, 'name', 'name')}
              placeholder={t('component.common.project.label.projectPriority')}
              id="project-priority-filter" />
          )
        },
        {
          name: 'department',
          label: t('component.common.project.label.sponsoringDepartment'),
          colSpan: 12,
          render: () => (
            <Select
              allowClear
              showSearch
              showArrow
              options={createOptionList(configurationMetrics?.sponsoringDepartment, 'name', 'name')}
              placeholder={t('component.common.project.label.sponsoringDepartment')}
              id="project-department-filter" />
          )
        },
        {
          name: 'currentStatus',
          label: t('component.common.project.label.projectStatus'),
          colSpan: 12,
          render: () => (
            <Select
              allowClear
              showSearch
              showArrow
              options={createOptionList(configurationMetrics?.projectStatus, 'name', 'name')}
              placeholder={t('component.common.project.label.projectStatus')}
              id="project-status-filter" />
          )
        },
        {
          name: 'currentState',
          label: t('component.common.project.label.projectStates'),
          colSpan: 12,
          render: () => (
            <Select
              allowClear
              showSearch
              showArrow
              options={createOptionList(configurationMetrics?.projectStates, 'name', 'name')}
              placeholder={t('component.common.project.label.projectStates')}
              id="project-state-filter" />
          )
        },
        {
          name: 'currentStage',
          label: t('component.common.project.label.projectStages'),
          colSpan: 12,
          render: () => (
            <Select
              allowClear
              showSearch
              showArrow
              options={createOptionList(configurationMetrics?.projectStages, 'name', 'name')}
              placeholder={t('component.common.project.label.projectStages')}
              id="project-stage-filter" />
          )
        },
        {
          name: 'milestones',
          label: t('component.common.project.label.milestones'),
          colSpan: 12,
          render: () => (
            <Select
              allowClear
              showSearch
              showArrow
              options={createOptionList(configurationMetrics?.milestones, 'name', 'name')}
              placeholder={t('component.common.project.label.milestones')}
              id="project-milestone-filter" />
          )
        }
      ]} />
  );
};

ProjectFilter.propTypes = {
  onApplyFilter: PropTypes.func.isRequired,
  onClearFilter: PropTypes.func.isRequired
};

export default ProjectFilter;
