import React from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { SIDE_NAV_WIDTH, SIDE_NAV_DARK, NAV_TYPE_SIDE } from 'constants/ThemeConstant';
import { Scrollbars } from 'react-custom-scrollbars-2';
import MenuContent from './MenuContent';

const { Sider } = Layout;

export function SideNav({
  navCollapsed, sideNavTheme, routeInfo, hideGroupTitle, privileges = []
}) {
  const privilegesKeys = {
    dashboards: 'dashboards'
  };

  privileges?.forEach(({ screen }) => {
    privilegesKeys[screen] = screen;
  });

  const props = {
    sideNavTheme, routeInfo, hideGroupTitle, privilegesKeys
  };

  return (
    <Sider
      className={`side-nav ${sideNavTheme === SIDE_NAV_DARK ? 'side-nav-dark' : ''}`}
      collapsed={navCollapsed}
      width={SIDE_NAV_WIDTH}>
      <Scrollbars autoHide>
        <MenuContent type={NAV_TYPE_SIDE} {...props} />
      </Scrollbars>
    </Sider>
  );
}

const mapStateToProps = ({ theme, user: userSlice }) => {
  const { navCollapsed, sideNavTheme } = theme;
  const { privileges } = userSlice;
  return {
    navCollapsed, sideNavTheme, privileges
  };
};

export default connect(mapStateToProps)(SideNav);
