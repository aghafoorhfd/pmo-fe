import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import { DIR_RTL } from 'constants/ThemeConstant';
import ThemeConfigurator from './ThemeConfigurator';

export function NavPanel({ direction }) {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="nav-item" onClick={showDrawer} role="presentation">
        <SettingOutlined className="nav-icon mr-0" />
      </div>
      <Drawer
        onClose={onClose}
        open={open}
        placement={direction === DIR_RTL ? 'left' : 'right'}
        title="Theme Config"
        width={350}>
        <ThemeConfigurator />
      </Drawer>
    </>
  );
}

export default NavPanel;
