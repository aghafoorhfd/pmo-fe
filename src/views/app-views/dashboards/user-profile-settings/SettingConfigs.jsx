import { LockFilled } from '@ant-design/icons';
import i18n from 'i18next';

// import your setting Form components here ('place it on forms key') in object.
import PasswordForm from './settings-forms/PasswordForm';

const { t } = i18n;

export const settingsList = [
  {
    key: 'password-settings',
    name: 'password-settings',
    description: t('component.user.profile.settings.forms.description'),
    heading: t('component.user.profile.settings.forms.changePasswordHeading'),
    icon: <LockFilled style={{ fontSize: '30px' }} />,
    forms: <PasswordForm />
  }
];
