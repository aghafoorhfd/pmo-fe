import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { toggleCollapsedNav, onMobileNavToggle } from 'store/slices/themeSlice';
import { NAV_TYPE_TOP, SIDE_NAV_COLLAPSED_WIDTH, SIDE_NAV_WIDTH } from 'constants/ThemeConstant';
import utils from 'utils';
import NavProfile from './NavProfile';
import NavHelp from './NavHelp';
import Logo from './Logo';

const { Header } = Layout;

export function HeaderNav(props) {
  const { isMobile } = props;

  const [, setSearchActive] = useState(false);

  const dispatch = useDispatch();

  const navCollapsed = useSelector((state) => state.theme.navCollapsed);
  const mobileNav = useSelector((state) => state.theme.mobileNav);
  const navType = useSelector((state) => state.theme.navType);
  const headerNavColor = useSelector((state) => state.theme.headerNavColor);
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  const onSearchClose = () => {
    setSearchActive(false);
  };

  const onToggle = () => {
    if (!isMobile) {
      dispatch(toggleCollapsedNav(!navCollapsed));
    } else {
      dispatch(onMobileNavToggle(!mobileNav));
    }
  };

  const isNavTop = navType === NAV_TYPE_TOP;

  const mode = () => {
    if (!headerNavColor) {
      return utils.getColorContrast(currentTheme === 'dark' ? '#00000' : '#ffffff');
    }
    return utils.getColorContrast(headerNavColor);
  };

  const navMode = mode();

  const getNavWidth = () => {
    if (isNavTop || isMobile) {
      return '0px';
    }
    if (navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
    }
    return `${SIDE_NAV_WIDTH}px`;
  };

  useEffect(() => {
    if (!isMobile) {
      onSearchClose();
    }
  });

  return (
    <Header className={`app-header ${navMode}`} style={{ backgroundColor: headerNavColor }}>
      <div className={`app-header-wrapper ${isNavTop ? 'layout-top-nav' : ''}`}>
        <Logo logoType={navMode} />
        <div className="nav" style={{ width: `calc(100% - ${getNavWidth()})` }}>
          <div className="nav-left">
            <div className="nav-item" onClick={onToggle} role="presentation">
              <div className="d-flex align-items-center">
                {navCollapsed || isMobile ? (
                  <MenuUnfoldOutlined className="nav-icon" />
                ) : (
                  <MenuFoldOutlined className="nav-icon" />
                )}
              </div>
            </div>
          </div>
          <div className="nav-right">
            <NavHelp />
            <NavProfile />
          </div>
        </div>
      </div>
    </Header>
  );
}

export default HeaderNav;
