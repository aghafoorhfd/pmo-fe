import React, { useState } from 'react';

import {
  Button, Form, Input, message, Row, Col, Space
} from 'antd';
import { useTranslation } from 'react-i18next';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { REGEX } from 'constants/RegexConstant';

import UserService from 'services/UserService';

export default function PasswordForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const { updatePassword } = UserService;

  const handleSubmit = async (values) => {
    setLoading(true);
    const { password } = values;
    try {
      await updatePassword({ password });
      message.success(t('component.auth.resetPassword.success.message'));
    } catch (err) {
      message.error(err?.message || t('component.auth.resetPassword.failure.message'));
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  const clear = () => {
    form.resetFields();
  };

  const sawExpression = (visible) => {
    if (visible) return <EyeTwoTone />;
    return <EyeInvisibleOutlined />;
  };

  return (
    <Form
      data-i="editPasswordForm"
      name="editPasswordForm"
      layout="vertical"
      form={form}
      onFinish={handleSubmit}>
      <Row
        gutter={{
          xs: 8, sm: 16, md: 24, lg: 24
        }}>
        <Col span={12}>
          <Form.Item
            data-i="password"
            label={t('component.auth.newPassword')}
            name="password"
            rules={[
              {
                required: true,
                message: t('component.auth.inputField.validationRule.1')
              },
              {
                required: true,
                min: 6,
                message: t('component.auth.inputField.passwordLength.message')
              },
              {
                required: true,
                pattern: REGEX.PASSWORD_FORMAT_REGEX,
                message: t('component.auth.inputField.validationRule.7')
              }
            ]}>
            <Input.Password data-i="input-password" placeholder={t('component.auth.placeholder.newPassword')} iconRender={(visible) => sawExpression(visible)} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            data-i="rewritePassword"
            label={t('component.auth.confirmPassword')}
            name="rewritePassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: t('component.auth.inputField.validationRule.3')
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('component.auth.password.not.match')));
                }
              })
            ]}>
            <Input.Password data-i="input-rewritePassword" placeholder={t('component.auth.placeholder.confirmPassword')} iconRender={(visible) => sawExpression(visible)} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="end">
        <Form.Item>
          <Space>
            <Button data-i="clear-btn" loading={loading} onClick={clear} style={{ width: '165px' }}>
              {t('component.user.profile.settings.forms.clear')}
            </Button>
            <Button data-i="updatePassword-btn" type="primary" disabled={loading} loading={loading} onClick={form.submit} style={{ width: '165px' }}>
              {t('component.user.profile.settings.forms.updatePassword')}
            </Button>
          </Space>
        </Form.Item>
      </Row>
    </Form>
  );
}
