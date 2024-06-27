import {
  Form, Input, Select
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Modal from 'components/shared-components/Modal/index';

function EditTeamFormModal({
  form, open, onCancel, onOk
}) {
  const [isFormTouched, setIsFormTouched] = useState(false);

  const onCancelHandler = () => {
    form.resetFields();
    setIsFormTouched(false);
    onCancel(false);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onOk(values);
      }).catch((info) => {
        throw info;
      });
  };

  const { t } = useTranslation();
  return (
    <Modal
      forceRender
      data-i="edit-team-form-modal"
      open={open}
      title={t('component.resource.team.edit.popup.title')}
      onCancel={onCancelHandler}
      confirmOnCancel={isFormTouched}
      onOk={form.submit}
      okText={t('component.common.save.label')}>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="horizontal"
        onFieldsChange={() => {
          setIsFormTouched(true);
        }}>
        <Form.Item
          name="teamName"
          label={t('component.resource.team.description.label.teamName')}
          rules={[{
            required: true,
            message: t('component.resource.team.form.validation.message', { role: t('component.resource.team.description.label.teamName') })
          }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="resourceManager"
          label={t('component.resource.team.description.label.resourceManager')}
          rules={[{
            required: true,
            message: t('component.resource.team.form.validation.message', { role: t('component.resource.team.description.label.resourceManager') })
          }]}>
          <Select disabled>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="teamSupervisor"
          label={t('component.resource.team.description.label.teamSupervisor')}
          rules={[{
            required: true,
            message: t('component.resource.team.form.validation.message', { role: t('component.resource.team.description.label.teamSupervisor') })
          }]}>
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="teamLead"
          label={t('component.resource.team.description.label.teamLead')}
          rules={[{
            required: true,
            message: t('component.resource.team.form.validation.message', { role: t('component.resource.team.description.label.teamLead') })
          }]}>
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

EditTeamFormModal.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func
};

EditTeamFormModal.defaultProps = {
  open: false,
  onCancel: () => {},
  onOk: () => {}
};

export default EditTeamFormModal;
