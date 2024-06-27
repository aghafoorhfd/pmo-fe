import React from 'react';
import { Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

function EllipsisDropdown({
  color, menu, placement, icon, rotate
}) {
  return (
    <Dropdown overlay={menu} placement={placement} trigger={['click']} getPopupContainer={(trigger) => trigger.parentNode}>
      <div className={`ellipsis-dropdown ${icon ? 'custom-dropdown-icon' : ''}`}>
        {icon || <EllipsisOutlined style={{ color }} rotate={rotate} />}
      </div>
    </Dropdown>
  );
}

EllipsisDropdown.propTypes = {
  menu: PropTypes.node,
  placement: PropTypes.string,
  icon: PropTypes.node,
  rotate: PropTypes.number
};

EllipsisDropdown.defaultProps = {
  placement: 'bottomRight',
  menu: <Menu />,
  icon: null,
  rotate: 90
};

export default EllipsisDropdown;
