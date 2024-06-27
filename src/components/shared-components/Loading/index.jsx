import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { LoadingOutlined } from '@ant-design/icons';
import './index.css';

const Icon = <LoadingOutlined spin style={{ fontSize: 35 }} />;

function Loading(props) {
  const {
    align, cover, entire, tip
  } = props;
  return (
    <div className={`loading text-${align} cover-${cover} cover-${entire}`}>
      <Spin {...tip && { tip }} indicator={Icon} />
    </div>
  );
}

Loading.propTypes = {
  cover: PropTypes.string,
  align: PropTypes.string,
  entire: PropTypes.string,
  tip: PropTypes.string
};

Loading.defaultProps = {
  align: 'center',
  cover: 'inline',
  entire: '',
  tip: ''
};

export default Loading;
