import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import {
  Col, DatePicker, Form, Input, Row, Select
} from 'antd';

import { useTranslation } from 'react-i18next';
import { createOptionList, spaceValidator } from 'utils/utils';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import moment from 'moment';
import { CONFLICT_ACTIONS } from 'constants/MiscConstant';

const RisktInfo = ({
  conflictForm,
  conflictDetailId,
  selectedTab,
  onChangeProject
}) => {
  const { t } = useTranslation();

  const {
    riskManagement: {
      optionsLoading,
      projectOptions: { data = [] } = {},
      conflictsDetails: { data: detailList = {} } = {}
    }
  } = useSelector((state) => ({
    riskManagement: state.riskManagement
  }));

  const { OPENED } = CONFLICT_ACTIONS;

  const populateData = () => (
    {
      conflictId: conflictDetailId,
      projectId: [{ label: detailList?.projectName, value: detailList?.projectId }],
      conflictName: detailList?.conflictName,
      description: detailList?.description,
      suggestedResolution: detailList?.suggestedResolution,
      createdDate: moment(detailList?.createdDate),
      daysOpen: detailList?.totalDays,
      createdBy: detailList?.createdBy,
      conflictStatus: detailList?.conflictStatus
    }
  );

  useEffect(() => {
    if (conflictDetailId) {
      conflictForm.setFieldsValue(populateData());
    }
  }, [conflictDetailId, data, detailList, conflictForm]);

  const rules = {
    projectId: [
      {
        required: true,
        message: t('component.conflict.manager.field.validation.projectName')
      }
    ],
    conflictName: [
      {
        validator: (_, value) => spaceValidator(value)
      },
      {
        required: true,
        message: t('component.conflict.manager.field.validation.riskName')
      }
    ],
    description: [
      {
        validator: (_, value) => spaceValidator(value)
      },
      {
        required: true,
        message: t('component.conflict.manager.field.validation.description')
      }
    ],
    suggestedResolution: [
      {
        validator: (_, value) => spaceValidator(value)
      },
      {
        required: true,
        message: t('component.conflict.manager.field.validation.suggested.resolution')
      }
    ]
  };

  const detailsDaysLabel = {
    OPENED: t('component.conflict.manager.details.daysOpen'),
    RESOLVED: t('table.component.column.daysTaken'),
    CANCELLED: t('table.component.column.daysTakenToCancel')
  };

  return (
    <Row gutter={[16, 8]}>
      <Col span={12}>
        <Form.Item
          hidden
          data-i="form-item-id"
          name="conflictId">
          <Input value={conflictDetailId} />
        </Form.Item>
        <Form.Item
          data-i="conflictName"
          name="conflictName"
          label={t('component.conflict.manager.details.riskName')}
          rules={rules.conflictName}
          hasFeedback>
          <Input id="conflict-info-conflictName" disabled={conflictDetailId} placeholder={t('component.conflict.manager.details.riskName')} allowClear />
        </Form.Item>
        <Form.Item
          data-i="description"
          name="description"
          label={t('component.conflict.manager.details.descriptionImpact')}
          rules={rules.description}
          hasFeedback>
          <Input.TextArea
            id="conflict-info-description"
            className="input-fields"
            disabled={conflictDetailId}
            placeholder={t('component.conflict.manager.details.descriptionImpact')}
            allowClear
            rows={4} />
        </Form.Item>
        <Form.Item
          data-i="projectId"
          name="projectId"
          label={t('table.component.column.project')}
          hasFeedback
          rules={rules.projectId}>
          <Select
            size="large"
            id="conflict-info-projectId"
            allowClear
            showSearch
            showArrow
            onChange={onChangeProject}
            loading={optionsLoading}
            getPopupContainer={(trigger) => trigger.parentNode}
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)
          || option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
            options={createOptionList(data, 'projectId', 'projectName')}
            placeholder={t('table.component.column.project')}
            disabled={conflictDetailId} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          data-i="suggestedResolution"
          name="suggestedResolution"
          label={t('component.conflict.manager.details.suggestedResolution')}
          rules={rules.suggestedResolution}
          hasFeedback>
          <Input.TextArea
            disabled={selectedTab !== OPENED}
            id="conflict-info-suggestedResolution"
            allowClear
            rows={1}
            placeholder={t('component.conflict.manager.details.suggestedResolution')} />
        </Form.Item>
        {conflictDetailId && (
        <>
          <Form.Item
            data-i="createdDate"
            name="createdDate"
            label={t('component.conflict.manager.details.dateOpened')}
            hasFeedback>
            <DatePicker
              className="w-100"
              id="conflict-info-createdDate"
              disabled
              allowClear
              format={DATE_FORMAT_MM_DD_YYYY}
              placement="bottomRight" />
          </Form.Item>
          <Form.Item
            data-i="createdBy"
            name="createdBy"
            label={t('component.conflict.manager.details.openedBy')}
            hasFeedback>
            <Input id="conflict-info-createdBy" placeholder={t('component.conflict.manager.details.openedBy')} allowClear disabled={conflictDetailId} />
          </Form.Item>
          <Form.Item
            data-i="conflictStatus"
            name="conflictStatus"
            label={t('component.common.status.label')}
            hasFeedback>
            <Input id="conflict-info-conflictStatus" placeholder={t('component.common.status.label')} allowClear disabled={conflictDetailId} />
          </Form.Item>
          <Form.Item
            data-i="daysOpen"
            name="daysOpen"
            label={detailsDaysLabel[selectedTab]}
            hasFeedback>
            <Input
              id="conflict-info-daysOpen"
              placeholder={t('component.conflict.manager.details.daysOpen')}
              allowClear
              type="number"
              disabled={conflictDetailId} />
          </Form.Item>
        </>
        )}
      </Col>
    </Row>
  );
};

RisktInfo.propTypes = {
  conflictDetailId: PropTypes.string
};

RisktInfo.defaultProps = {
  conflictDetailId: ''
};

export default RisktInfo;
