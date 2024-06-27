import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  parsePhoneNumberWithError, ParseError, isValidPhoneNumber
} from 'libphonenumber-js';
import { PHONE_NUMBER_ERRORS } from 'constants/MiscConstant';
import { PhoneInput } from 'react-international-phone';
// eslint-disable-next-line import/no-unresolved
import 'react-international-phone/style.css';
import './index.css';

const PhoneNumberInput = () => {
  const { t } = useTranslation();

  const validatePhoneNumber = (_, value) => {
    if (value) {
      try {
        parsePhoneNumberWithError(value);
      } catch (error) {
        if (error instanceof ParseError) {
          return Promise.reject(t(PHONE_NUMBER_ERRORS[error.message]));
        }
      }

      if (!isValidPhoneNumber(value)) {
        return Promise.reject(t(PHONE_NUMBER_ERRORS.NOT_A_NUMBER));
      }
    }
    return Promise.resolve();
  };

  const rules = {

    phoneNumber: [
      {
        validator: validatePhoneNumber
      }
    ]
  };

  return (
    <Form.Item
      data-i="form-item-number"
      name="phoneNumber"
      rules={rules.phoneNumber}
      label={t('component.userForm.label.number')}>
      <PhoneInput placeholder={t('component.userForm.label.number')} disableDialCodePrefill id="phone-input" />
    </Form.Item>
  );
};

export default PhoneNumberInput;
