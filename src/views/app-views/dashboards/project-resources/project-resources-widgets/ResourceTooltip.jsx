import React from 'react';
import '../index.css';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import moment from 'moment';

const TooltipContent = ({ task } = {}) => {
  const { resources = [] } = task || {};

  if (resources.length <= 0) {
    return null;
  }
  return (
    <div className="tool-tip-container">
      {resources?.map((res) => (
        <div className="resource-item" key={res?.resourceId}>
          <span className="font-size-sm resource-duration">{`${moment(res.fromDate).format(DATE_FORMAT_MM_DD_YYYY)} - ${moment(res.toDate).format(DATE_FORMAT_MM_DD_YYYY)}`}</span>
          <span className="font-weight-semibold resource-name ">{` - ${res?.firstName} ${res?.lastName ? res.lastName : ''}`}</span>
        </div>
      ))}
    </div>
  );
};

export default TooltipContent;
