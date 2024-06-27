import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  InfoCircleOutlined, MailOutlined, UserOutlined, BookOutlined
} from '@ant-design/icons';
import {
  Button, Form, Input, Alert, Row, Col, notification
} from 'antd';
import { signUp, hideAuthMessage, showLoading } from 'store/slices/authSlice';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { REGEX } from 'constants/RegexConstant';
import { STATUS } from 'constants/StatusConstant';
import ToolTip from 'components/shared-components/Tooltip';
import { SELECTED_PACKAGE_KEY } from 'constants/MiscConstant';
import { getValueFromLocalStorage } from 'utils/utils';

const RegisterForm = () => {
  const { t } = useTranslation();

  const {
    auth: {
      loading, message, showMessage, status
    }
  } = useSelector((state) => ({
    auth: state.auth
  }));
  const isSuccess = status === STATUS.SUCCESS;
  const rules = {
    firstName: [
      {
        required: true,
        message: t('component.inputField.message.firstName')

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
        message: t('component.inputField.message.lastName')
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
    ]
  };

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onSignUp = () => {
    const { planPackageId, noOfLicenses } = getValueFromLocalStorage(SELECTED_PACKAGE_KEY) || {};

    form
      .validateFields()
      .then((values) => {
        dispatch(showLoading());
        dispatch(signUp({
          ...values,
          ...(planPackageId ? { planPackageId, requiredLicenses: +noOfLicenses } : {})
        }));
      })
      .catch((info) => {
        const notificationParam = {
          message: ''
        };

        notificationParam.message = info.message;
        notification.error(notificationParam);
      });
  };

  useEffect(() => {
    if (showMessage && !isSuccess) {
      const timer = setTimeout(() => dispatch(hideAuthMessage()), 4000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [showMessage]);

  return (
    <>
      { status && (
      <motion.div
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
          marginTop: isSuccess ? 20 : 0
        }}
        initial={{ opacity: 0, marginBottom: 0, marginTop: 0 }}>
        <Alert message={message} showIcon type={status} />
      </motion.div>
      )}
      {
         !isSuccess
         && (
         <Form form={form} layout="vertical" name="register-form" onFinish={onSignUp}>
           <Form.Item
             label={t('component.product.admin.organization.name')}
             name="organizationName"
             rules={[
               {
                 required: true,
                 message: t('component.product.admin.organization.name.required')
               },
               {
                 pattern: REGEX.SPECIAL_CHARACTER_WITH_STRING,
                 message: t('component.auth.inputField.numeric.value.notAllowed')
               }
             ]}>
             <Input placeholder={t('component.product.admin.organization.name')} prefix={<BookOutlined className="text-primary" />} data-i="company-name" />
           </Form.Item>

           <Form.Item
             label={t('component.product.admin.subDomain.name')}
             name="tenantId"
             rules={[
               {
                 required: true,
                 message: t('component.product.admin.subDomain.name.required')
               },
               {
                 pattern: REGEX.ALPHA_NUMERIC,
                 message: t('component.auth.inputField.special.characters.allowed')
               }
             ]}>
             <Input placeholder={t('component.product.admin.subDomain.name')} prefix={<BookOutlined className="text-primary" />} data-i="company-name" />
           </Form.Item>
           <Form.Item name="firstName" label={t('component.inputField.label.firstName')} rules={rules.firstName} hasFeedback>
             <Input data-i="firstName" placeholder={t('component.inputField.label.firstName')} prefix={<UserOutlined className="text-primary" />} />
           </Form.Item>
           <Form.Item name="lastName" label={t('component.inputField.label.lastName')} rules={rules.lastName} hasFeedback>
             <Input data-i="lastName" placeholder={t('component.inputField.label.lastName')} prefix={<UserOutlined className="text-primary" />} />
           </Form.Item>
           <Form.Item
             hasFeedback
             label={(
               <Row className="d-flex flex-row" style={{ width: '17.1rem' }}>
                 <Col>
                   {t('component.label.email')}
                 </Col>
                 <Col className="px-2">
                   <ToolTip className="cursor-pointer" title={t('component.email.format.help.text')} icon={<InfoCircleOutlined />} />
                 </Col>
               </Row>
           )}
             name="email"
             rules={rules.email}>
             <Input data-i="email" placeholder={t('component.auth.email')} prefix={<MailOutlined className="text-primary" />} />
           </Form.Item>
           <Form.Item>
             <Button block disabled={loading || showMessage} data-i="sign-up" htmlType="submit" loading={loading} type="primary">
               {t('component.button.signUp')}
             </Button>
           </Form.Item>
         </Form>
         )

      }

    </>
  );
};

export default RegisterForm;
