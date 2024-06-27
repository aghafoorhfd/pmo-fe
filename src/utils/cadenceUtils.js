import moment from 'moment';
import { DATE_FORMAT_MMM_D_YEAR, DATE_FORMAT_MMM_D } from 'constants/DateConstant';

export const preProcessingQuartersData = (quarters = []) => {
  const quartersRange = { id: 'quarters' };
  const quartersNames = [];
  quarters.forEach(({ startDate, endDate, name }, index) => {
    quartersNames.push(name);
    quartersRange[`quarter${index}`] = `${moment(startDate).format(DATE_FORMAT_MMM_D_YEAR)} - ${moment(endDate).format(DATE_FORMAT_MMM_D_YEAR)}`;
  });
  return [quartersRange, quartersNames];
};

export const preProcessingSprintsData = (sprints = []) => {
  const obj = { id: 'sprints' };
  if (sprints.length > 0) {
    const { name } = sprints[0] || {};
    let i = name?.split(' ')[1];
    sprints.forEach(({ startDate, endDate }) => {
      obj[`sprint${i}`] = `${moment(startDate).format(DATE_FORMAT_MMM_D)} - ${moment(endDate).format(DATE_FORMAT_MMM_D)}`;
      i++;
    });
  }
  return [obj];
};
