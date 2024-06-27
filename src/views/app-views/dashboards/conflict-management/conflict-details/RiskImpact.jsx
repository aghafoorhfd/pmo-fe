import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import {
  Col, Form, Row, Select
} from 'antd';

import { CONFLICT_ACTIONS, SEVERITY_OPTIONS } from 'constants/MiscConstant';
import { createOptionList, getFilteredItem } from 'utils/utils';

import './Styles.css';
import { uniqBy } from 'lodash';

const RisktItem = ({
  selectedTab,
  impactedMemebersOptions,
  label,
  name,
  optionsLoading,
  impactedOtherProjectsOptions,
  placeHolder,
  rules,
  teamOptions,
  selectedProjectId,
  id,
  isUserHasAccess
}) => {
  const selectFieldsDropdownOptions = {
    impactedTeamIds: createOptionList(teamOptions, 'id', 'teamName'),
    impactedMemberIds: createOptionList(impactedMemebersOptions, 'id', 'label'),
    impactedOtherProjectIds: createOptionList(impactedOtherProjectsOptions, 'projectId', 'projectName').filter((x) => x.value !== selectedProjectId),
    conflictSeverity: SEVERITY_OPTIONS
  };

  const { OPENED } = CONFLICT_ACTIONS;

  const dropDownValues = selectFieldsDropdownOptions[name];

  return (
    <Col span={12}>
      <Form.Item
        label={label}
        rules={rules}
        name={name}
        hasFeedback>
        <Select
          allowClear
          disabled={selectedTab !== OPENED || isUserHasAccess}
          showSearch
          mode={name === 'conflictSeverity' ? 'single' : 'multiple'}
          id={id}
          loading={optionsLoading}
          getPopupContainer={(trigger) => trigger.parentNode}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)
              || option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
          filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
          options={dropDownValues?.map((e) => ({ label: e?.label, value: e?.value }))}
          showArrow
          placeholder={placeHolder} />
      </Form.Item>
    </Col>
  );
};

RisktItem.propTypes = {
  impactedMemebersOptions: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  optionsLoading: PropTypes.bool.isRequired,
  impactedOtherProjectsOptions: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
  placeHolder: PropTypes.string.isRequired,
  teamOptions: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
  selectedProjectId: PropTypes.string.isRequired
};

const RiskImpact = ({
  selectedTab,
  conflictForm,
  conflictDetailId,
  selectedProjectId,
  isUserHasAccess
}) => {
  const { t } = useTranslation();
  const {
    riskManagement: {
      optionsLoading,
      impactedOtherProjectOptions: { data: impactedOtherProjectsOptions = [] } = {},
      impactedTeamsOptions: { data: teamOptions = [] } = {},
      impactedMembersOptions: { data: impactedMembersOptions = [] } = {},
      conflictsDetails: { data: detailList = {} } = {}
    }
  } = useSelector((state) => ({
    riskManagement: state.riskManagement
  }));

  const impactedMemebersOptions = uniqBy(impactedMembersOptions?.map(
    ({ id, firstName, lastName }) => (
      {
        id,
        label: `${firstName} ${lastName}`
      }
    )
  ), 'id');
  const impacts = [
    {
      key: '1',
      name: 'impactedTeamIds',
      label: t('component.conflict.manager.details.impactedTeam'),
      placeHolder: t('component.conflict.manager.details.select.impactedTeam'),
      id: 'impacted-team'
    },
    {
      key: '2',
      name: 'impactedMemberIds',
      label: t('component.conflict.manager.details.impactedMember'),
      placeHolder: t('component.conflict.manager.details.select.impactedMembers'),
      id: 'impacted-member'
    },
    {
      key: '3',
      name: 'impactedOtherProjectIds',
      label: t('component.conflict.manager.details.impactedOtherProject'),
      placeHolder: t('component.conflict.manager.details.select.impactedProjects'),
      id: 'impacted-projects'
    },
    {
      key: '4',
      name: 'conflictSeverity',
      rules: [{ required: true, message: t('component.conflict.manager.field.validation.severity') }],
      label: t('component.conflict.manager.details.severity'),
      placeHolder: t('component.conflict.manager.details.select.severity'),
      id: 'conflict-severity'
    }
  ];

  const populateData = () => ({
    impactedTeamIds: createOptionList(getFilteredItem(teamOptions, detailList.impactedTeamIds), 'id', 'teamName'),
    impactedMemberIds: createOptionList(getFilteredItem(impactedMemebersOptions, detailList?.impactedMemberIds), 'id', 'label'),
    impactedOtherProjectIds: createOptionList(getFilteredItem(impactedOtherProjectsOptions, detailList?.impactedOtherProjectIds), 'projectId', 'projectName'),
    conflictSeverity: detailList?.conflictSeverity
  });

  useEffect(() => {
    if (conflictDetailId) {
      conflictForm.setFieldsValue(populateData());
    }
  }, [conflictDetailId, detailList,
    impactedOtherProjectsOptions, teamOptions, impactedMembersOptions]);

  return (
    <Row gutter={[16, 8]}>
      {impacts?.map((impact) => (
        <React.Fragment key={impact.key}>
          <RisktItem
            selectedTab={selectedTab}
            conflictForm={conflictForm}
            detailList={detailList}
            impactedMemebersOptions={impactedMemebersOptions}
            key={impact.key}
            {...impact}
            isUserHasAccess={isUserHasAccess}
            optionsLoading={optionsLoading}
            impactedOtherProjectsOptions={impactedOtherProjectsOptions}
            teamOptions={teamOptions}
            selectedProjectId={selectedProjectId} />
        </React.Fragment>
      ))}
    </Row>
  );
};

RiskImpact.propTypes = {
  conflictDetailId: PropTypes.string,
  selectedProjectId: PropTypes.string,
  onSelectImpactedTeams: PropTypes.func
};

RiskImpact.defaultProps = {
  conflictDetailId: '',
  selectedProjectId: '',
  onSelectImpactedTeams: null
};

export default RiskImpact;
