import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Grid, Row } from 'antd';
import navigationConfig from 'configs/NavigationConfig';
import { useSelector, useDispatch } from 'react-redux';
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from 'constants/ThemeConstant';
import utils from 'utils';
import { onMobileNavToggle } from 'store/slices/themeSlice';
import Icon from '../util-components/Icon';
import IntlMessage from '../util-components/IntlMessage';
import './MenuContent.css';

const { useBreakpoint } = Grid;

const setLocale = (localeKey, isLocaleOn = true) => {
  const localeStatus = isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString();
  return localeStatus;
};

const setDefaultOpen = (key) => {
  const keyList = [];
  let keyString = '';
  if (key) {
    const arr = key.split('-');
    for (let index = 0; index < arr.length; index++) {
      const elm = arr[index];
      // eslint-disable-next-line no-unused-expressions
      keyString = index === 0 ? elm : `${keyString}-${elm}`;
      keyList.push(keyString);
    }
  }
  return keyList;
};

function MenuItem({ title, icon, path }) {
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();

  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
  const activePath = pathname === path ? `${pathname}${search}` : path;

  const closeMobileNav = () => {
    if (isMobile) {
      dispatch(onMobileNavToggle(false));
    }
  };

  return (
    <Row align="middle">
      {icon && <Icon type={icon} />}
      <span style={{ paddingTop: 3 }}>{setLocale(title)}</span>
      {activePath && <Link onClick={closeMobileNav} to={activePath} />}
    </Row>
  );
}

const getSideNavMenuItem = (navItem, privilegesKeys) => navItem.map((nav) => (
  {
    key: nav.key,
    style: { display: privilegesKeys && privilegesKeys[nav.key] ? 'block' : 'none' },
    label: (
      <MenuItem
        title={nav.title}
        {...(nav.isGroupTitle ? {} : { path: nav.path, icon: nav.icon })} />
    ),
    ...(nav.isGroupTitle ? { type: 'group' } : {}),
    ...(nav.submenu.length > 0 ? {
      children: getSideNavMenuItem(
        nav.submenu,
        privilegesKeys
      )
    } : {})
  }
));

const getTopNavMenuItem = (navItem) => navItem.map((nav) => ({
  key: nav.key,
  label: (
    <MenuItem
      icon={nav.icon}
      title={nav.title}
      {...(nav.isGroupTitle ? {} : { path: nav.path })} />
  ),
  ...(nav.submenu.length > 0 ? { children: getTopNavMenuItem(nav.submenu) } : {})
}));

function SideNavContent(props) {
  const {
    routeInfo, hideGroupTitle, privilegesKeys
  } = props;

  const sideNavTheme = useSelector((state) => state.theme.sideNavTheme);

  const menuItems = getSideNavMenuItem(navigationConfig, privilegesKeys);

  return (
    <Menu
      className={`side-nav-bar ${hideGroupTitle ? 'hide-group-title' : ''}`}
      defaultOpenKeys={setDefaultOpen(routeInfo?.key)}
      defaultSelectedKeys={[routeInfo?.key]}
      items={menuItems}
      mode="inline"
      style={{ height: '100%', borderRight: 0, fontSize: 16 }}
      theme={sideNavTheme === SIDE_NAV_LIGHT ? 'light' : 'dark'} />
  );
}

function TopNavContent() {
  const topNavColor = useSelector((state) => state.theme.topNavColor);

  const menuItems = useMemo(() => getTopNavMenuItem(navigationConfig), []);

  return <Menu items={menuItems} mode="horizontal" style={{ backgroundColor: topNavColor }} />;
}

function MenuContent(props) {
  return props.type === NAV_TYPE_SIDE ? (
    <SideNavContent {...props} />
  ) : (
    <TopNavContent {...props} />
  );
}

export default MenuContent;
