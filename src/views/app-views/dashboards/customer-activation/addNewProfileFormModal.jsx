import {
  Col,
  DatePicker,
  Divider,
  Form, Input, Row, Select
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Modal from 'components/shared-components/Modal/index';
import './add-new-profile-form-styles.css';
import { REGEX } from 'constants/RegexConstant';

const AddNewProfileFormModal = ({
  form, open, onCancel, onOk
}) => {
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
        onOk(values);
      }).catch((info) => {
        throw info;
      });
  };

  const { t } = useTranslation();
  return (
    <Modal
      forceRender
      data-i="add-new-profile-form-modal"
      width={800}
      open={open}
      title={t('component.addNewProfile.form.modal.popup.title')}
      onCancel={onCancelHandler}
      confirmOnCancel={isFormTouched}
      onOk={form.submit}
      okText={t('component.common.save.label')}>
      <Form
        form={form}
        layout="horizontal"
        onFinish={handleSubmit}
        onFieldsChange={() => {
          setIsFormTouched(true);
        }}>
        <Row gutter={[16, 16]} justify="space-between">
          <Col flex="1">
            <Form.Item
              name="firstName"
              label={t('component.addNewProfile.form.modal.popup.firstName')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.firstName') })
              },
              {
                min: 3,
                message: t('component.userForm.name.length')
              },
              {
                pattern: REGEX.ALPHABET_ALLOW_FORMAT_REGEX,
                message: t('component.userForm.alphabet.validation')
              }]}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.firstName')} />
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item
              name="lastName"
              label={t('component.addNewProfile.form.modal.popup.lastName')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.lastName') })
              },
              {
                min: 3,
                message: t('component.userForm.name.length')
              },
              {
                pattern: REGEX.ALPHABET_ALLOW_FORMAT_REGEX,
                message: t('component.userForm.alphabet.validation')
              }]}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.lastName')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="space-between">
          <Col flex="1">
            <Form.Item
              name="email"
              label={t('component.addNewProfile.form.modal.popup.email')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.email') })
              },
              {
                type: 'email',
                message: t('component.auth.inputField.validationRule.5')
              }]}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.email')} />
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item
              name="companyName"
              label={t('component.addNewProfile.form.modal.popup.companyName')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.companyName') })
              }]}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.companyName')} />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]} justify="space-between">
          <Col flex="1">
            <Form.Item
              name="planType"
              label={t('component.addNewProfile.form.modal.popup.planType')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.planType') })
              }]}>
              <Select>
                <Select.Option value="B2B">B2B</Select.Option>
                <Select.Option value="WEB" disabled>WEB</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item
              name="billingCycle"
              label={t('component.addNewProfile.form.modal.popup.billingCycle')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.billingCycle') })
              }]}>
              <Select>
                <Select.Option value="annually">
                  {t('component.addNewProfile.form.modal.popup.billingCycle.options.annually')}
                </Select.Option>
                <Select.Option value="monthly">
                  {t('component.addNewProfile.form.modal.popup.billingCycle.options.monthly')}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="space-between">
          <Col flex="1">
            <Form.Item
              name="amountPerLicense"
              label={t('component.addNewProfile.form.modal.popup.amountPerLicense')}
              rules={[
                {
                  required: true,
                  message: t('component.addNewProfile.form.validation.message', {
                    role: t('component.addNewProfile.form.modal.popup.amountPerLicense')
                  })
                },
                () => ({
                  validator(_, value) {
                    if (value < 0) {
                      return Promise.reject(new Error(t('component.addNewProfile.input.label.validation.length')));
                    }
                    return Promise.resolve();
                  }
                })
              ]}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.amountPerLicense')}
                type="number"
                min={1} />
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item
              name="billingDate"
              label={t('component.addNewProfile.form.modal.popup.billingDate')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.billingDate') })
              }]}>
              <DatePicker
                className="w-100"
                placeholder={t('component.projectMetrics.form.placeholder.date')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="space-between">
          <Col flex="1">
            <Form.Item
              name="noOfLicenses"
              label={t('component.addNewProfile.form.modal.popup.noOfLicenses')}
              rules={[{
                required: true,
                message: t('component.addNewProfile.form.validation.message', { role: t('component.addNewProfile.form.modal.popup.noOfLicenses') })
              },
              () => ({
                validator(_, value) {
                  if (value < 50) {
                    return Promise.reject(new Error(t('component.addNewProfile.form.validation.min.noOfLicenses')));
                  }
                  return Promise.resolve();
                }
              })
              ]}>
              <Input
                type="number"
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.noOfLicenses')} />
            </Form.Item>
          </Col>
          <Col flex="1">
            <Form.Item
              name="promoCode"
              label={t('component.addNewProfile.form.modal.popup.promoCode')}>
              <Input
                placeholder={t('component.addNewProfile.form.modal.popup.placeholder.promoCode')} />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Modal>
  );
};

AddNewProfileFormModal.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func
};

AddNewProfileFormModal.defaultProps = {
  open: false,
  onCancel: () => {},
  onOk: () => {}
};

export default AddNewProfileFormModal;
