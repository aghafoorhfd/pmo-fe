import React from 'react';
import PropTypes from 'prop-types';
import { Card as AntdCard } from 'antd';
import CardHeader from './CardHeader';

const Card = (props) => {
  const {
    customizedHeader, heading, description, actionBtn, tagText, children, showBorder, ...restProps
  } = props;
  return (
    <AntdCard {...restProps}>
      {(heading || customizedHeader) && (
      <CardHeader
        customizedHeader={customizedHeader}
        heading={heading}
        description={description}
        actionBtn={actionBtn}
        tagText={tagText}
        showBorder={showBorder} />
      )}

      {children}

    </AntdCard>
  );
};

Card.propTypes = {
  customizedHeader: PropTypes.element,
  bordered: PropTypes.bool,
  heading: PropTypes.string,
  actionBtn: PropTypes.node,
  description: PropTypes.string,
  tagText: PropTypes.string,
  showBorder: PropTypes.bool
};

Card.defaultProps = {
  customizedHeader: null,
  bordered: false,
  heading: '',
  actionBtn: null,
  description: '',
  tagText: '',
  showBorder: false
};

export { Card };
