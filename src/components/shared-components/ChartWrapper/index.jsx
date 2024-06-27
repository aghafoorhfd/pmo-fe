import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

function ChartWrapper({
  children, className
}) {
  return (
    <div className="chart-wrapper-grid">
      <div className={`chart-wrapper-item ${className}`}>
        {children}
      </div>
    </div>

  );
}

ChartWrapper.propTypes = {
  className: PropTypes.string
};
ChartWrapper.defaultProps = {
  className: ''
};
export default ChartWrapper;
