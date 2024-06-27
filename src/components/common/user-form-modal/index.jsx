import React, { useEffect, useState } from 'react';
import {
  Alert, Col, Form, Input, Row, Select
} from 'antd';
import Modal from 'components/shared-components/Modal/index';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { USER_FORM_ACCESSTYPE } from 'constants/DropdownOptions';
import { REGEX } from 'constants/RegexConstant';
import { useDispatch, useSelector } from 'react-redux';
import {
  addUser, editUser, resetStatus, toggleForm
} from 'store/slices/userSlice';
import { STATUS } from 'constants/StatusConstant';
import { capitalize } from 'utils/utils';
import {
  parsePhoneNumber
} from 'libphonenumber-js';
import { ROLES } from 'constants/RolesConstant';
import { noop } from 'lodash';
import { USER_DASHBOARD_ACTIONS, USER_REGISTRATION_STATUS } from 'constants/MiscConstant';
import './index.css';
import { InfoCircleOutlined } from '@ant-design/icons';
import ToolTip from 'components/shared-components/Tooltip';
import PhoneNumberInput from 'components/shared-components/PhoneNumberInput';

const { SUCCESS } = STATUS;
const UserForm = ({
  selectedRecord, setSelectedRecord, action, setAction = noop, onlyGeneralUser
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [accessTypeOptions, setAccessTypeOptions] = useState(USER_FORM_ACCESSTYPE);
  const dispatch = useDispatch();
  const {
    user: { isFormVisible, status, loading },
    auth: { user }
  } = useSelector((state) => ({
    user: state.user,
    auth: state.auth
  }));
  const isFormEditable = Object.keys(selectedRecord)?.length > 0;

  const getModalTitle = () => (isFormEditable
    ? t('component.userForm.edit.user.title')
    : t('component.userForm.add.user.title'));

  const getOkText = () => (isFormEditable
    ? t('component.common.update.label')
    : t('component.common.add.label'));

  const getSecondaryButtonText = () => {
    const actionText = {
      [USER_DASHBOARD_ACTIONS.GRANT_ACCESS]: t('component.userForm.action.grantAccess'),
      [USER_DASHBOARD_ACTIONS.REVOKE_ACCESS]: t('component.userForm.action.revokeLicense')
    };
    if (isFormEditable && action?.actionType) {
      return actionText[action?.actionType];
    }
    return t('component.auth.cancel');
  };
  const getSecondaryButtonAction = () => () => action.actionHandler(selectedRecord);

  useEffect(() => {
    if (status === SUCCESS) {
      form.resetFields();
      setIsFormTouched(false);
      setSelectedRecord({});
      dispatch(resetStatus());
    }
    if (user === ROLES.PROJECT_MANAGER || onlyGeneralUser) {
      setAccessTypeOptions(
        USER_FORM_ACCESSTYPE.filter(({ value }) => value === ROLES.GENERAL_USER)
      );
    }
  }, [status]);

  useEffect(() => {
    if (isFormEditable) {
      const {
        firstName, id, lastName, accessType, email, phoneNumber
      } = selectedRecord;
      const parsedPhoneNumber = phoneNumber
        ? parsePhoneNumber(`+${phoneNumber}`).number
        : '';
      form.setFieldsValue({
        id, firstName, lastName, accessType, email, phoneNumber: parsedPhoneNumber
      });
    }
  }, [selectedRecord]);

  const rules = {
    firstName: [
      {
        required: true,
        message: t('component.userForm.name.required')
      },
      {
        min: 2,
        message: t('component.inputField.message.firstName.length')
      },
      {
        pattern: REGEX.ALPHABET_ALLOW_FORMAT_REGEX,
        message: t('component.userForm.alphabet.validation')
      }
    ],
    lastName: [
      {
        required: true,
        message: t('component.userForm.lastName.required')
      },
      {
        min: 2,
        message: t('component.inputField.message.lastName.length')
      },
      {
        pattern: REGEX.ALPHABET_ALLOW_FORMAT_REGEX,
        message: t('component.userForm.alphabet.validation')
      }
    ],
    email: [
      {
        required: true,
        message: t('component.auth.inputField.validationRule.4')
      },
      {
        type: 'email',
        message: t('component.auth.inputField.validationRule.5')
      }
    ],
    options: [
      {
        required: true,
        message: t('component.userForm.dropdown.value.required')
      }
    ]
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const {
          id, email, phoneNumber, accessType, firstName, lastName
        } = values || {};
        const { countryCallingCode, nationalNumber } = phoneNumber
          ? parsePhoneNumber(phoneNumber)
          : {};
        const payload = {
          id,
          email: email.toLowerCase(),
          accessType,
          ...(phoneNumber && countryCallingCode ? { phoneNumber: `${countryCallingCode}${nationalNumber}` } : {}),
          firstName: capitalize(firstName),
          lastName: capitalize(lastName)
        };
        dispatch(isFormEditable ? editUser(payload) : addUser(payload));
      })
      .catch((info) => {
        throw info;
      });
  };

  const handleCancel = () => {
    dispatch(toggleForm(false));
    setIsFormTouched(false);
    setAction({ actionType: null, actionHandler: noop });
    form.resetFields();
    setSelectedRecord({});
  };

  const secondaryActionsButtons = () => (
    [
      {
        action: isFormEditable && action?.actionType && action?.actionHandler ? getSecondaryButtonAction() : 'close',
        block: true,
        colSpan: 12,
        label: getSecondaryButtonText(),
        type: 'default'
      },
      {
        action: form.submit,
        block: true,
        colSpan: 12,
        label: getOkText(),
        disable: loading || action.actionType === USER_DASHBOARD_ACTIONS.GRANT_ACCESS
        || action.actionType === USER_DASHBOARD_ACTIONS.REVOKE_ACCESS,
        loading,
        type: 'primary'
      }
    ]
  );

  const filteredOptions = () => {
    if (user === ROLES.ADMIN) {
      return accessTypeOptions.filter(({ value }) => value !== ROLES.ADMIN);
    }
    return accessTypeOptions;
  };

  const userFormContent = () => {
    const isInActive = selectedRecord.registrationStatus === USER_REGISTRATION_STATUS.REVOKED.key;
    return (
      <>
        {isFormEditable && action?.actionType && (
        <Alert
          className={`mb-4 ${isInActive ? 'inactive-user-alert' : 'active-user-alert'}`}
          message={isInActive ? t('component.user.dashboard.alert.inactive.message') : t('component.user.dashboard.alert.active.message')}
          description={isInActive ? t('component.user.dashboard.alert.inactive.description') : t('component.user.dashboard.alert.active.description')}
          type={isInActive ? 'error' : 'success'} />
        )}
        <Form
          form={form}
          onFinish={handleSubmit}
          disabled={action.actionType === USER_DASHBOARD_ACTIONS.GRANT_ACCESS
              || action.actionType === USER_DASHBOARD_ACTIONS.REVOKE_ACCESS}
          layout="vertical"
          name="user-modal-form"
          data-i="user-form"
          onFieldsChange={() => {
            setIsFormTouched(true);
          }}>
          <Form.Item hidden data-i="form-item-id" name="id">
            <Input />
          </Form.Item>
          <Form.Item
            data-i="form-item-firstName"
            id="form-item-firstName"
            name="firstName"
            label={t('component.inputField.label.firstName')}
            rules={rules.firstName}
            hasFeedback>
            <Input
              data-i="form-item-firstName-inputField"
              id="form-item-firstName-inputField"
              allowClear
              placeholder={t('component.inputField.message.firstName')} />
          </Form.Item>
          <Form.Item
            data-i="form-item-lastName"
            id="form-item-lastName"
            name="lastName"
            label={t('component.inputField.label.lastName')}
            rules={rules.lastName}
            hasFeedback>
            <Input
              data-i="form-item-lastName-inputField"
              id="form-item-lastName-inputField"
              allowClear
              placeholder={t('component.inputField.message.lastName')} />
          </Form.Item>
          <Form.Item
            data-i="form-item-accessType"
            id="form-item-accessType"
            name="accessType"
            label={t('component.userForm.label.accessType')}
            rules={rules.options}
            hasFeedback>
            <Select
              name="accessType"
              data-i="form-item-accessType-inputField"
              id="form-item-accessType-inputField"
              allowClear
              showSearch
              placeholder={t('component.userForm.dropdown.placeholder')}
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)
              || option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
              filterSort={(optionA, optionB) => (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())}
              options={filteredOptions()}
              getPopupContainer={(trigger) => trigger.parentNode} />
          </Form.Item>
          <Form.Item
            data-i="form-item-email"
            id="form-item-email"
            name="email"
            label={(
              <Row className="d-flex flex-row" style={{ width: '21.2rem' }}>
                <Col>
                  { t('component.label.email') }
                </Col>
                <Col className="px-2">
                  <ToolTip className="cursor-pointer" title={t('component.email.format.help.text')} icon={<InfoCircleOutlined />} />
                </Col>
              </Row>
              )}
            rules={rules.email}
            hasFeedback>
            <Input
              data-i="form-item-email-inputField"
              id="form-item-email-inputField"
              disabled={isFormEditable}
              allowClear
              placeholder={t('component.auth.email')} />
          </Form.Item>
          <PhoneNumberInput />
        </Form>
      </>
    );
  };
  return (
    <Modal
      destroyOnClose
      forceRender
      data-i="user-form-modal"
      confirmOnCancel={isFormTouched}
      open={isFormVisible}
      title={getModalTitle()}
      description={isFormEditable ? t('component.userForm.edit.user.description') : t('component.userForm.add.user.description')}
      onOk={form.submit}
      okText={getOkText()}
      onCancel={handleCancel}
      footer={null}
      secondaryActionsButtons={secondaryActionsButtons()}>
      {userFormContent()}
    </Modal>
  );
};

UserForm.propTypes = {
  setSelectedRecord: PropTypes.func.isRequired,
  selectedRecord: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    accessType: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string
  }),
  action: PropTypes.shape({
    actionType: PropTypes.string,
    actionHandler: PropTypes.func
  }),
  onlyGeneralUser: PropTypes.bool
};

UserForm.defaultProps = {
  selectedRecord: {},
  action: {
    actionType: '',
    actionHandler: noop
  },
  onlyGeneralUser: false
};

export default UserForm;
