import {
  Col,
  DatePicker,
  Form, Input, InputNumber, Radio, Row, Select
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Modal from 'components/shared-components/Modal/index';
import { useDispatch, useSelector } from 'react-redux';
import { addResourceInTeam, getUsersList, updateResourceInTeam } from 'store/slices/resourceTeamSlice';
import { noop } from 'lodash';
import moment from 'moment';
import { capitalize, createOptionList } from 'utils/utils';
import { ACCESS_TYPES } from 'constants/AccessTypes';
import { addUser, hideUserMessage, toggleForm } from 'store/slices/userSlice';
import { getConfigurationOptions } from 'store/slices/projectDetailsSlice';
import { InfoCircleOutlined } from '@ant-design/icons';
import ToolTip from 'components/shared-components/Tooltip';
import {
  parsePhoneNumber
} from 'libphonenumber-js';
import PhoneNumberInput from 'components/shared-components/PhoneNumberInput';

import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import ResourceService from 'services/ResourceService';
import { REGEX } from 'constants/RegexConstant';

const { RangePicker } = DatePicker;

const AddResourceFormModal = ({
  form, open, onClose, teamId, selectedResource, setSelectedResource, teamLeads
}) => {
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [isNewResource, setIsNewResource] = useState(false);
  const [optionList, setOptionList] = useState([]);
  const [resourceCapacityMessage, setResourceCapacityMessage] = useState({ message: '', color: '' });
  const [availableResourceCapacity, setAvailableResourceCapacity] = useState(undefined);
  const [isResourceAssigned, setIsResourceAssigned] = useState(false);
  const isFormEditable = Object.keys(selectedResource).length > 0;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    resourceId, message, showMessage
  } = useSelector((state) => state.user);
  const {
    resourceTeam: {
      usersList, fromLoading, isResourceDataFetched
    },
    projectDetails: { configurationMetrics: { resourceDiscipline = [] } }
  } = useSelector((state) => ({
    resourceTeam: state.resourceTeam,
    projectDetails: state.projectDetails
  }));

  useEffect(() => {
    dispatch(getConfigurationOptions());
  }, []);

  const fetchResourceHours = async (userId) => {
    try {
      const {
        data: {
          resourceAccumulatedCapacity
        }
      } = await ResourceService.getResourceDetails(userId);
      setAvailableResourceCapacity(resourceAccumulatedCapacity || 0);
    } catch (err) {
      if (err?.code === '1002') {
        setAvailableResourceCapacity(0);
      }
    }
  };

  const setAvailableHoursMessage = () => {
    const {
      designation,
      resourceCapacity: resourceCapacityFieldValue = 0,
      defaultHoursOccupied = 0
    } = form.getFieldsValue();

    if (designation) {
      const { resourceCapacity } = resourceDiscipline.find((value) => value.name === designation);
      const availableHours = resourceCapacity - (
        (availableResourceCapacity || 0) + (resourceCapacityFieldValue - defaultHoursOccupied)
      );

      if (availableHours >= 0) {
        setResourceCapacityMessage({ message: t('component.resource.team.capacity.available', { availableHours, color: 'gray' }) });
      }

      if (availableHours < 0) {
        setResourceCapacityMessage({ message: t('component.resource.team.capacity.over.occupied', { occupiedHours: Math.abs(availableHours) }), color: '#ff6b72' });
      }
    }
  };
  useEffect(() => {
    if (availableResourceCapacity >= 0 && resourceDiscipline.length) {
      setAvailableHoursMessage();
    }
  }, [availableResourceCapacity, resourceDiscipline]);

  const rules = {
    resourceName: [{
      required: true,
      message: t('component.resource.team.form.validation.message', { role: t('component.resource.team.resourceName') })
    }],
    email: [
      {
        required: true,
        message: t('component.resource.team.form.validation.message', { role: t('component.resource.team.email') })
      },
      {
        type: 'email',
        message: t('component.auth.inputField.validationRule.5')
      }
    ],
    firstName: [
      {
        required: true,
        message: t('component.resource.team.form.validation.message', { role: t('component.resource.team.firstName') })
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
        message: t('component.resource.team.form.validation.message', { role: t('component.resource.team.lastName') })
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
    designation: [{
      required: true,
      message: t('component.resource.team.form.validation.message', { role: t('component.resource.team.resourceDiscipline') })
    }],
    resourceCapacity: [{
      required: true,
      message: t('component.resource.team.form.validation.message', { role: t('component.resource.team.resourceCapacity') })
    }]
  };

  const addNewUser = (values) => {
    const {
      firstName, lastName, email,
      phoneNumber
    } = values;
    const { countryCallingCode, nationalNumber } = phoneNumber
      ? parsePhoneNumber(phoneNumber)
      : {};
    const data = {
      email: email.toLowerCase(),
      accessType: ACCESS_TYPES.GENERAL_USER,
      firstName: capitalize(firstName),
      lastName: capitalize(lastName),
      ...(phoneNumber && countryCallingCode ? { phoneNumber: `${countryCallingCode}${nationalNumber}` } : {})
    };
    dispatch(addUser(data));
  };

  const addAndUpdateResource = (values) => {
    const {
      resourceCapacity, resourceName, designation,
      plannedVacations
    } = values;

    const resourceValues = typeof resourceName === 'string' ? resourceName?.split(' ') : resourceName?.value.split(' ');
    const payload = {
      resourceCapacity,
      resourceId: resourceValues[0],
      designation,
      ...(isFormEditable && plannedVacations ? { plannedVacationsEndDate: plannedVacations[1].format('YYYY-MM-DD'), plannedVacationsStartDate: plannedVacations[0].format('YYYY-MM-DD') } : {})
    };

    if (isFormEditable) {
      dispatch(updateResourceInTeam({ data: payload, teamId }));
    } else {
      dispatch(addResourceInTeam({ data: payload, teamId }));
    }
  };

  useEffect(() => {
    if (isFormEditable) {
      setIsResourceAssigned(selectedResource?.capacityDetails?.some(
        (detail) => detail.isAssigned
      ) || false);
      const {
        plannedVacations = [], firstName,
        lastName, email, designation,
        resourceId: userId, resourceCapacity
      } = selectedResource;
      const vacationsToEdit = plannedVacations
        ? plannedVacations[plannedVacations.length - 1]
        : null;

      form.setFieldsValue({
        resourceName: {
          label: `${firstName} ${lastName} (${email})`,
          value: `${userId} ${designation} ${email}`
        },
        designation,
        resourceCapacity,
        plannedVacations: vacationsToEdit?.startDate && vacationsToEdit?.endDate
          && [moment(vacationsToEdit.startDate), moment(vacationsToEdit.endDate)],
        defaultHoursOccupied: resourceCapacity
      });
      fetchResourceHours(userId);
    }
  }, [selectedResource]);

  useEffect(() => {
    if (showMessage) {
      if (resourceId
        && message === t('component.user.dashboard.userAdded.success.message')
      ) {
        const resourceForm = { ...form.getFieldsValue(), resourceName: resourceId };
        addAndUpdateResource(resourceForm);
      }

      dispatch(hideUserMessage());
    }
  }, [showMessage]);

  useEffect(() => {
    const teamLeadEmailSet = new Set(teamLeads.map(({ email }) => email));
    const options = usersList?.filter(({ email }) => !teamLeadEmailSet.has(email)).map((user) => ({
      label: `${user.firstName} ${user.lastName} (${user.email})`,
      value: `${user.id} ${user.accessType} ${user.email}`
    }));
    if (options.length > 0) {
      setOptionList(options);
    }
  }, [usersList]);

  const onCancelHandler = () => {
    form.resetFields();
    setIsFormTouched(false);
    /* Reason to use toggleForm(false) over here to update the state isFormVisible,
    false because we are adding the new user form here */
    dispatch(toggleForm(false));
    onClose(false);
    setSelectedResource({});
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (isNewResource) {
          addNewUser(values);
        } else {
          addAndUpdateResource(values);
        }
      }).catch((info) => {
        throw info;
      });
  };

  const handleChange = () => {
    if (!isResourceDataFetched) {
      dispatch(getUsersList());
    }
  };

  const onTabChange = (e) => {
    setIsNewResource(e.target.value);
    setResourceCapacityMessage({ message: '', color: '' });
    setAvailableResourceCapacity(undefined);
    form.resetFields();
  };

  return (
    <Modal
      forceRender
      data-i="add-resource-form-modal"
      open={open}
      title={!isFormEditable ? t('component.resource.add.resource.popup.title') : t('component.resource.edit.resource.popup.title')}
      onCancel={onCancelHandler}
      confirmOnCancel={isFormTouched}
      onOk={form.submit}
      okText={t('component.common.save.label')}>
      {
        !isFormEditable && (
          <Radio.Group
            value={isNewResource}
            onChange={onTabChange}
            className="mb-4"
            id="resource-type-radio">
            <Radio value={false}>{t('component.resource.team.resourceDiscipline.existing')}</Radio>
            <Radio value>{t('component.resource.team.resourceDiscipline.new')}</Radio>
          </Radio.Group>
        )
      }
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFieldsChange={() => {
          setIsFormTouched(true);
        }}>
        {
          isFormEditable && (
            <Form.Item
              hidden
              data-i="default-hours-occupied"
              name="defaultHoursOccupied" />
          )
        }
        {
          !isNewResource && (
            <Form.Item
              name="resourceName"
              label={t('component.resource.team.resourceName')}
              rules={rules.resourceName}>
              <Select
                disabled={isFormEditable}
                data-i="form-option-resourceName"
                id="form-option-resourceName"
                name="resourceName"
                showSearch
                loading={fromLoading}
                placeholder={t('component.resource.team.placeholder.resourceName')}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                options={optionList?.map((e) => ({ label: e?.label, value: e?.value }))}
                onFocus={handleChange}
                onChange={(value) => fetchResourceHours(value.split(' ')[0])}
                getPopupContainer={(trigger) => trigger.parentNode} />
            </Form.Item>
          )
        }
        {

          !isFormEditable && isNewResource && (
            <>
              <Form.Item
                label={(
                  <Row className="d-flex flex-row" style={{ width: '21.2rem' }}>
                    <Col>
                      {t('component.resource.team.email')}
                    </Col>
                    <Col className="px-2">
                      <ToolTip className="cursor-pointer" title={t('component.email.format.help.text')} icon={<InfoCircleOutlined />} />
                    </Col>
                  </Row>
                )}
                name="email"
                rules={rules.email}>
                <Input allowClear placeholder={t('component.resource.team.email')} />
              </Form.Item>
              <PhoneNumberInput />
              <Form.Item
                data-i="form-item-teamName"
                id="form-item-teamName"
                name="firstName"
                label={t('component.resource.team.firstName')}
                rules={rules.firstName}
                hasFeedback>
                <Input id="form-input-teamName" data-i="form-input-teamName" allowClear placeholder={t('component.resource.team.firstName')} />
              </Form.Item>
              <Form.Item
                data-i="form-item-teamName"
                id="form-item-teamName"
                name="lastName"
                label={t('component.resource.team.lastName')}
                rules={rules.lastName}
                hasFeedback>
                <Input id="form-input-teamName" data-i="form-input-teamName" allowClear placeholder={t('component.resource.team.lastName')} />
              </Form.Item>
            </>
          )
        }
        <Form.Item
          name="designation"
          label={t('component.resource.team.resourceDiscipline')}
          rules={rules.designation}>
          <Select
            disabled={isFormEditable || (!isNewResource && availableResourceCapacity === undefined)}
            placeholder={t('component.resource.team.placeholder.selectResourceDiscipline')}
            id="resourceDiscipline-option"
            onChange={setAvailableHoursMessage}
            options={createOptionList(resourceDiscipline, 'name', 'name')}
            getPopupContainer={(trigger) => trigger.parentNode} />
        </Form.Item>
        <Form.Item
          name="resourceCapacity"
          label={t('component.resource.team.resourceCapacity')}
          rules={rules.resourceCapacity}
          className="mb-1">
          <InputNumber onFocus={(e) => e.target.addEventListener('wheel', (ev) => { ev.preventDefault(); }, { passive: false })} disabled={isResourceAssigned} className="w-100" min={1} onChange={setAvailableHoursMessage} type="number" placeholder={t('component.resource.team.placeholder.selectResourceCapacity')} />
        </Form.Item>
        {
          resourceCapacityMessage.message && (
            <span style={{ color: resourceCapacityMessage.color }}>
              {resourceCapacityMessage.message}
            </span>
          )
        }
        {
          isFormEditable && (
            <Form.Item
              name="plannedVacations"
              label={t('component.resource.team.plannedVacationTime')}>
              <RangePicker
                className="w-100"
                allowClear
                id="planned-vacation-picker"
                format={DATE_FORMAT_MM_DD_YYYY} />
            </Form.Item>
          )
        }
      </Form>
    </Modal>
  );
};

AddResourceFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  teamId: PropTypes.string,
  selectedResource: PropTypes.shape({}),
  setSelectedResource: PropTypes.func
};

AddResourceFormModal.defaultProps = {
  open: false,
  onClose: noop,
  teamId: '',
  selectedResource: {},
  setSelectedResource: noop
};

export default AddResourceFormModal;
