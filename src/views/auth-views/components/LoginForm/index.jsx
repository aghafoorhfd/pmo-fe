import React, { useEffect } from 'react';
import {
  Button, Form, Input, Alert
} from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import {
  signIn, showLoading, hideAuthMessage, updateRedirectURL
} from 'store/slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import IntlMessage from 'components/util-components/IntlMessage';
import { getSubdomain } from 'utils/utils';

export function LoginForm(props) {
  const {
    loading, message, showMessage, token, redirect
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { allowRedirect = true } = props;
  const onLogin = (values) => {
    dispatch(showLoading());
    dispatch(signIn({ ...values, tenantId: getSubdomain(window.location.href) }));
  };

  useEffect(() => {
    if (token !== null && allowRedirect) {
      navigate(redirect);
    }
    if (showMessage) {
      const timer = setTimeout(() => dispatch(hideAuthMessage()), 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  });
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const redirectURL = queryParams.get('redirect');
    dispatch(updateRedirectURL(redirectURL));
  }, [location.search]);

  return (
    <>
      <motion.div
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0
        }}
        initial={{ opacity: 0, marginBottom: 0 }}>
        <Alert message={message} showIcon type="error" />
      </motion.div>
      <Form
        layout="vertical"
        name="login-form"
        onFinish={onLogin}>
        <Form.Item
          label={t('component.label.email')}
          name="email"
          rules={[
            {
              required: true,
              message: <IntlMessage id="component.auth.inputField.validationRule.4" />
            },
            {
              type: 'email',
              message: <IntlMessage id="component.auth.inputField.validationRule.5" />
            }
          ]}>
          <Input placeholder={t('component.label.email')} prefix={<MailOutlined className="text-primary" />} data-i="email" />
        </Form.Item>
        <Form.Item
          label={t('component.label.password')}
          name="password"
          rules={[
            {
              required: true,
              message: <IntlMessage id="component.auth.inputField.validationRule.1" />
            },
            {
              min: 6,
              message: <IntlMessage id="component.auth.inputField.validationRule.6" />
            }
          ]}>
          <Input.Password placeholder={t('component.label.password')} prefix={<LockOutlined className="text-primary" />} data-i="password" />
        </Form.Item>
        <Form.Item>
          <Button block htmlType="submit" loading={loading} type="primary" data-i="signIn-button">
            {t('component.button.signIn')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default LoginForm;
