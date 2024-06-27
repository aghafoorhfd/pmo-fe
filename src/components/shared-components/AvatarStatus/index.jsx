import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';

const renderAvatar = (props) => (
  <Avatar {...props} className={`ant-avatar-${props.type}`}>
    {props.text}
  </Avatar>
);

export function AvatarStatus(props) {
  const {
    name, suffix, subTitle, id, type, src, icon, size, shape, gap, text, onNameClick
  } = props;
  return (
    <div className="avatar-status d-flex align-items-center">
      {renderAvatar({
        icon,
        src,
        type,
        size,
        shape,
        gap,
        text
      })}
      <div className="ml-2">
        <div>
          {onNameClick ? (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              className="avatar-status-name clickable"
              onClick={() => onNameClick({
                name,
                subTitle,
                src,
                id
              })}>
              {name}
            </div>
          ) : (
            <div className="avatar-status-name">{name}</div>
          )}
          <span>{suffix}</span>
        </div>
        <div className="text-muted avatar-status-subtitle">{subTitle}</div>
      </div>
    </div>
  );
}

AvatarStatus.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onNameClick: PropTypes.func.isRequired
};

export default AvatarStatus;
