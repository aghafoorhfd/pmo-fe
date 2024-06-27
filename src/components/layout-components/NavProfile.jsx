import React from 'react';
import { Menu, Dropdown, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { signOut } from 'store/slices/authSlice';
import { useTranslation } from 'react-i18next';

import { USER_PROFILE_SETTINGS } from 'configs/AppConfig';
import { resetSliceAction } from 'store/actions/resetSlice';

export function NavProfile() {
  const {
    auth: {
      userProfile: {
        firstName, lastName, accessTypeName
      } = {}
    } = {}
  } = useSelector((state) => ({
    auth: state.auth
  }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleSignOut = () => {
    const { pathname } = location;
    dispatch(resetSliceAction());
    dispatch(signOut(pathname));
  };

  const handleClick = ({ key }) => {
    if (key === 'Sign Out') {
      handleSignOut();
    } else if (key === 'User Profile Settings') {
      navigate(USER_PROFILE_SETTINGS);
    }
  };

  const menu = (
    <Menu
      items={[
        {
          key: 'User Profile Settings',
          label: t('component.button.settings'),
          icon: <SettingOutlined className="font-size-md" />
        },
        {
          key: 'Sign Out',
          label: t('component.button.signOut'),
          icon: <LogoutOutlined className="font-size-md" />
        }
      ]}
      onClick={handleClick} />
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight" trigger={['click']} getPopupContainer={(trigger) => trigger.parentNode}>
      <div className="nav-item">
        <div className="d-flex align-items-center">
          <Avatar icon={<UserOutlined />} />
          <div className="pl-2 d-none d-sm-block profile-text">
            <div className="font-size-base font-weight-bold">{`${firstName} ${lastName}`}</div>
            <span className="opacity-0-8">{accessTypeName}</span>
          </div>
        </div>
      </div>
    </Dropdown>
  );
}

export default NavProfile;
