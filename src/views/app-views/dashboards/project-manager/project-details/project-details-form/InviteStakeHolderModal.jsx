import {
  Col, Row, Select, Form, Typography
} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { noop } from 'lodash';
import UserForm from 'components/common/user-form-modal';

const InviteStakeHolder = ({
  getDropDown,
  setIsFormTouched,
  setCheckInviteModal,
  form,
  handleSubmit,
  generalUserOptions,
  selectedStakeHolders
}) => {
  const { t } = useTranslation();

  const updatedGeneralUserOptions = generalUserOptions?.filter(
    ({ value }) => !selectedStakeHolders?.find(({ value: val }) => val === value)
  );

  return (
    <>
      <Row>
        <Col lg={24} md={24} xs={24}>
          <Form
            form={form}
            onFieldsChange={() => {
              setIsFormTouched(true);
              setCheckInviteModal(true);
            }}
            onFinish={() => {
              handleSubmit();
            }}
            layout="vertical"
            data-i="form-item-invite">
            <Form.Item
              data-i="form-item-invite-stakeholder"
              name="stakeholder"
              label={t('component.project.manager.project.details.stakeholder.label.inviteStakeHolder')}
              rules={[{
                required: true,
                message: t('component.project.manager.project.details.validation.invite.stakeholder.message')
              }]}
              hasFeedback>
              <Select
                name="stakeHolder"
                allowClear
                showSearch
                placeholder={t('component.project.manager.project.details.stakeholder.label.inviteStakeHolder')}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                options={updatedGeneralUserOptions}
                mode="multiple"
                dropdownRender={(menu) => (
                  getDropDown(menu)
                )}
                getPopupContainer={(trigger) => trigger.parentNode} />
            </Form.Item>
          </Form>

        </Col>
      </Row>
      <Row>
        <Col lg={24} md={24} xs={24} className="text-center pl-2">
          <Typography.Text strong>{t('component.project.manager.project.details.validation.invite.stakeholder.note')}</Typography.Text>
        </Col>
      </Row>

      <UserForm
        setSelectedRecord={noop}
        onlyGeneralUser />
    </>
  );
};
InviteStakeHolder.propTypes = {
  handleSubmit: PropTypes.func,
  generalUserOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }))
};

InviteStakeHolder.defaultProps = {
  handleSubmit: noop,
  generalUserOptions: []
};
export default InviteStakeHolder;
