import { Tabs } from 'antd';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { useNavigate, useLocation } from 'react-router-dom';
/*
  Wrapper component for the Tabs
*/
const BasicTabs = ({
  items, tabBarExtraContent, onTabChange, selectedTab, pillShaped
}) => {
  const navigate = useNavigate();
  const { search, hash } = useLocation();
  const initialTabFromHash = hash.slice(1);
  const [activeTab, setActiveTab] = useState(initialTabFromHash || selectedTab);

  const tabChangeHandler = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
    navigate(`${search}#${tab}`);
  };

  return (
    <Tabs
      className={pillShaped ? 'pill-shape-tabs font-weight-semibold ' : 'font-weight-semibold '}
      activeKey={activeTab}
      key={activeTab}
      defaultActiveKey={activeTab}
      tabBarExtraContent={tabBarExtraContent}
      onChange={tabChangeHandler}
      items={items} />
  );
};

BasicTabs.propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  tabBarExtraContent: PropTypes.node,
  onTabChange: PropTypes.func,
  selectedTab: PropTypes.string,
  pillShaped: PropTypes.bool
};

BasicTabs.defaultProps = {
  selectedTab: 'ACTIVE',
  tabBarExtraContent: null,
  onTabChange: noop,
  pillShaped: false
};
export default BasicTabs;
