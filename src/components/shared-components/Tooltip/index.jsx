import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Typography } from 'antd';

import './Styles.css';

export default function ToolTip({
  background, title, icon, bullets, className
}) {
  const { Text } = Typography;
  const textToDisplayHandler = () => {
    if (typeof title !== 'string' && title.length > 1) {
      return (
        bullets
          ? title?.map((value) => (
            <ul
              key={`title-${value}`}
              className="tool-tip-text bullet-alignment">
              <li>{value.toString()}</li>
            </ul>
          ))
          : title?.map((value) => (
            <Text
              key={`title-${value}`}
              className="tool-tip-text">
              {value.toString()}
              <br />
            </Text>
          )));
    }
    if (typeof title === 'string') {
      return (
        <Text
          className="tool-tip-text">
          {title}
        </Text>
      );
    }
    return null;
  };

  return (
    <Tooltip className={className} color={background} title={textToDisplayHandler}>
      {icon}
    </Tooltip>
  );
}

ToolTip.propTypes = {
  background: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  icon: PropTypes.element,
  bullets: PropTypes.bool,
  className: PropTypes.string
};

ToolTip.defaultProps = {
  background: '',
  title: '',
  className: '',
  icon: false,
  bullets: false
};
