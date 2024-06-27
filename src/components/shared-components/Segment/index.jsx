import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { Col, Row, Segmented } from 'antd';

import './SegmentStyles.css';

export const Segments = (props) => {
  const {
    disabled, options, onChange, value, className, size, ...rest
  } = props;

  return (
    <Row>
      <Col className="col-left">
        <Segmented
          className={className ? `segmented ${className}` : 'segmented'}
          size={size}
          options={options}
          onChange={onChange}
          value={value}
          disabled={disabled}
          {...rest} />
      </Col>
    </Row>
  );
};

Segments.propTypes = {
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.objectOf),
  onChange: PropTypes.func,
  value: PropTypes.string,
  size: PropTypes.string
};

Segments.defaultProps = {
  disabled: false,
  options: [],
  onChange: noop,
  value: '',
  size: 'large'
};
