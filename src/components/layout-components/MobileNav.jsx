import React from 'react';
import { Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { NAV_TYPE_SIDE } from 'constants/ThemeConstant';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { onMobileNavToggle } from 'store/slices/themeSlice';
import Flex from 'components/shared-components/Flex';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Logo from './Logo';
import MenuContent from './MenuContent';

export function MobileNav({ routeInfo, hideGroupTitle }) {
  const dispatch = useDispatch();

  const sideNavTheme = useSelector((state) => state.theme.sideNavTheme);
  const mobileNav = useSelector((state) => state.theme.mobileNav);

  const menuContentprops = { sideNavTheme, routeInfo, hideGroupTitle };

  const onClose = () => {
    dispatch(onMobileNavToggle(false));
  };

  return (
    <Drawer
      bodyStyle={{ padding: 5 }}
      closable={false}
      onClose={onClose}
      open={mobileNav}
      placement="left">
      <Flex className="h-100" flexDirection="column">
        <Flex alignItems="center" justifyContent="between">
          <Logo mobileLogo />
          <div className="nav-close" onClick={() => onClose()} role="presentation">
            <ArrowLeftOutlined />
          </div>
        </Flex>
        <div className="mobile-nav-menu">
          <Scrollbars autoHide>
            <MenuContent type={NAV_TYPE_SIDE} {...menuContentprops} />
          </Scrollbars>
        </div>
      </Flex>
    </Drawer>
  );
}

export default MobileNav;
