import { range, sortBy } from 'lodash';
import IntlMessage from 'components/util-components/IntlMessage';
import moment from 'moment';
import {
  BILLING_STATUS_COLOURS, CONFLICTS_VALUES, MILESTONES_STATUS, USER_GRAPH_STATUS
} from 'constants/MiscConstant';
import ProjectService from 'services/ProjectService';
import {
  DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_DD_MM_YYYY_WITH_SLASH, DATE_FORMAT_MM_DD_YYYY_WITH_SLASH,
  DATE_FORMAT_YYYY_MM_DD, DATE_FORMAT_MM_YYYY
} from 'constants/DateConstant';
import ROUTES from 'constants/RouteConstants';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import i18n from 'i18next';
import { formatNumber } from 'libphonenumber-js';
import americanexpressSvg from '../assets/cards/american-express.svg';
import visaSvg from '../assets/cards/visa.svg';
import mastercardSvg from '../assets/cards/mastercard.svg';
import discoverSvg from '../assets/cards/discover.svg';
import unionpaySvg from '../assets/cards/unionpay.svg';
import jcbSvg from '../assets/cards/jcb.svg';
import dinersSvg from '../assets/cards/diners.svg';
import { mapper } from './mapper';

const { t } = i18n;

export const calculateSortedMilestones = (milestones) => sortBy(milestones, (
  { endDate }
) => moment(endDate, DATE_FORMAT_DD_MM_YYYY_WITH_SLASH));

export const getValueFromLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const calculateQuarterData = (quarters) => {
  const today = moment();
  let spentDays = 0;
  let remainingDays = 0;

  quarters?.forEach((quarter) => {
    if (today.isSameOrAfter(quarter?.startDate) && today.isSameOrBefore(quarter?.endDate)) {
      spentDays = Math.max(0, today.diff(moment(quarter?.startDate), 'days', true));

      remainingDays = Math.max(0, Math.ceil(moment(quarter?.endDate).diff(today, 'days', true)));
    }
  });

  const calculatePercentage = (value, total) => (total > 0 ? (value / total) * 100 : 0);

  const totalDays = spentDays + remainingDays;
  const spentPercentage = calculatePercentage(spentDays, totalDays);
  const remainingPercentage = calculatePercentage(remainingDays, totalDays);

  const roundedSpentDays = spentDays.toFixed(0);
  const roundedRemainingDays = remainingDays.toFixed(0);

  const spentDaysText = `${t('component.general.user.project.sprint.spent.days', { spentDays: roundedSpentDays })} ${spentPercentage.toFixed(0)}%`;
  const remainingDaysText = `${t('component.general.user.project.sprint.remaining.days', { remainingDays: roundedRemainingDays })} ${remainingPercentage.toFixed(0)}%`;
  const quarterSprintLabels = [
    spentDaysText,
    remainingDaysText
  ];

  return { spentDays, remainingDays, quarterSprintLabels };
};

const getDates = (s, e) => {
  const dates = [];
  let startDate = moment(s, DATE_FORMAT_YYYY_MM_DD);
  dates.push({ date: startDate.format(DATE_FORMAT_YYYY_MM_DD), hours: 8 });
  while (!startDate.isSame(e)) {
    startDate = startDate.add(1, 'days');
    dates.push({ date: startDate.format(DATE_FORMAT_YYYY_MM_DD), hours: 8 });
  }
  return dates;
};

export const calculateSpentAndRemainingHours = (currentHalfSprints) => {
  const currentDate = moment().format(DATE_FORMAT_YYYY_MM_DD);
  const matchedSprint = currentHalfSprints?.find((record) => moment(
    currentDate
  ).isBetween(record.startDate, record.endDate));

  if (matchedSprint) {
    const datesList = getDates(matchedSprint.startDate, matchedSprint.endDate);
    const { remainingHours, spentHours } = datesList.reduce(
      (acc, curr) => {
        const day = new Date(curr.date).getDay();
        const isWeekend = day === 0 || day === 6;
        if (!isWeekend) {
          if (moment().diff(curr.date, 'days') === 0) {
            return { ...acc, remainingHours: acc.remainingHours + 8 };
          }
          return { ...acc, spentHours: acc.spentHours + 8 };
        }

        return acc;
      },
      {
        spentHours: 0,
        remainingHours: 0
      }
    );

    const isLastDay = moment(currentDate.date).isSame(matchedSprint.endDate, 'day');

    const totalSpentHours = spentHours + remainingHours;
    const totalRemainingHours = remainingHours + spentHours;

    const spentPercentage = (spentHours / (totalSpentHours)) * 100;
    const remainingPercentage = (remainingHours / (totalRemainingHours)) * 100;

    const remainingMessage = isLastDay ? t('component.general.user.project.sprint.remaining.title') : '';
    const lastDayMessage = isLastDay ? t('component.general.user.project.sprint.last.day.title') : '';

    const spentHoursText = `${t('component.general.user.project.sprint.spent.message', { spentHours })} ${spentPercentage.toFixed(0)}%`;
    const remainingMessageText = `${t('component.general.user.project.sprint.remaining.message', { remainingMessage })}`;
    const remainingHoursText = `${t('component.general.user.project.sprint.remaining.hours', { remainingHours })} ${remainingPercentage.toFixed(0)}%`;

    const labels = [
      spentHoursText,
      isLastDay ? remainingMessageText : remainingHoursText
    ];

    return {
      spentHours,
      remainingHours,
      labels,
      lastDayMessage
    };
  }
  return {
    spentHours: 0,
    remainingHours: 0,
    labels: [],
    lastDayMessage: ''
  };
};

const getFormatedDate = (date) => moment(date).format(DATE_FORMAT_DD_MM_YYYY);
const compareDate = (date, start, end) => {
  const formatedDate = moment(getFormatedDate(date), DATE_FORMAT_DD_MM_YYYY);
  const formatedStart = moment(getFormatedDate(start), DATE_FORMAT_DD_MM_YYYY);
  const formatedEnd = moment(getFormatedDate(end), DATE_FORMAT_DD_MM_YYYY);
  return formatedDate.isBetween(formatedStart, formatedEnd, null, '[]');
};

export const calculateTotalCount = (stats) => stats?.reduce((sum, stat) => sum + stat.count, 0);

export const checkProjectRange = (
  sprintStartDate,
  sprintEndDate,
  projectAssignedStartDate,
  projectAssignedEndDate
) => {
  const isProjectAssignStartDateInRange = compareDate(
    projectAssignedStartDate,
    sprintStartDate,
    sprintEndDate
  );
  const isProjectAssignEndDateInRange = compareDate(
    projectAssignedEndDate,
    sprintStartDate,
    sprintEndDate
  );
  const isSprintStartDateInRange = compareDate(
    sprintStartDate,
    projectAssignedStartDate,
    projectAssignedEndDate
  );
  const isSprintEndDateInRange = compareDate(
    sprintEndDate,
    projectAssignedStartDate,
    projectAssignedEndDate
  );

  return isProjectAssignStartDateInRange
      || isProjectAssignEndDateInRange || isSprintStartDateInRange || isSprintEndDateInRange;
};

export const getDefaultSearchParam = (agile, sdlc) => {
  if (agile || (!agile && !sdlc)) {
    return methodologyType.AGILE_CAPS;
  }

  return methodologyType.SDLC_CAPS;
};

export const setValuesToLocalStorage = (key, value) => {
  const data = typeof value === 'object' ? JSON.stringify(value) : value;
  localStorage.setItem(key, data);
};

export const scrollIntoColumn = (index) => {
  const scrollDownSmoothy = document.getElementById(index);
  scrollDownSmoothy?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
};

export const removeItemFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const hasPermission = (allRoles, currentRole) => allRoles?.includes(currentRole);

export const antdTableSorter = (a1, b1, key) => {
  if (typeof a1[key] === 'string' && typeof b1[key] === 'string') {
    const a = a1[key].toLowerCase();
    const b = b1[key].toLowerCase();
    if (a > b) { return 1; }
    return b > a ? -1 : 0;
  }
};

/**
 * {dataList}: data array, can be array of primitive type ot array of object
 * {valueKey}: key to get value attribute from data object, required if dataList is array of object
 * {labelKey}: key to get label attribute from data object, required if dataList is array of object
 */
export const createOptionList = (dataList, valueKey, labelKey) => {
  try {
    if (Array.isArray(dataList)) {
      return dataList?.map((dataItem) => {
        let label;
        let value;
        if (typeof dataItem !== 'object') {
          label = dataItem;
          value = dataItem;
        } else {
          label = dataItem[labelKey];
          value = dataItem[valueKey];
        }
        return { label, value };
      });
    }
    return [];
  } catch (err) {
    return [];
  }
};

export const preSelectedStakeHolders = (dataList, selectedList) => {
  const generalUserList = dataList?.reduce((
    acc,
    { firstName, lastName, email: stakeHolderEmail }
  ) => {
    if (selectedList?.includes(stakeHolderEmail)) {
      return [...acc, { label: `${firstName} ${lastName}`, value: stakeHolderEmail }];
    }
    return acc;
  }, []);
  return generalUserList;
};

export const findBy = (finderKey, finderVal, array) => (
  array?.find((obj) => finderVal === obj[finderKey])
);

const getSubStages = (isStages, subStages) => (isStages ? { subStages: subStages || [] } : {});

export const preProcessingData = (
  globalData = [],
  companyData = {},
  isStages = false,
  isResourceDiscipline = false
) => {
  const globalDataList = globalData?.map(({ name, subStages }, index) => ({
    key: index + 1,
    title: name,
    disabled: true,
    ...getSubStages(isStages, subStages)
  })) || [];
  const globalDataListLength = globalDataList.length + 1;

  // processing companyData Data to pass in the Transfer Component
  const companyDataList = companyData?.selected?.map(({ name, subStages, ...rest }, index) => ({
    key: globalDataListLength + index,
    title: name,
    ...(isResourceDiscipline && rest.seedResourceDiscipline && { disabled: true }),
    ...getSubStages(isStages, subStages),
    ...rest
  })) || [];
  const newDataLength = globalDataListLength + companyDataList.length;
  const companyDataListNotSelected = companyData?.notSelected?.map(
    ({ name, subStages, ...rest }, index) => ({
      key: newDataLength + index,
      title: name,
      ...getSubStages(isStages, subStages),
      ...rest
    })
  ) || [];
  // generating TargetKeys to show selected Milestones in the Right side tab
  const targetKeys = range(1, (globalDataListLength
    + companyDataList.length));
  return [[...globalDataList, ...companyDataList, ...companyDataListNotSelected], targetKeys];
};

export const getFilteredItem = (dropList, selectedList) => {
  if (Array.isArray(selectedList)) {
    const fileredItems = dropList?.filter((item) => {
      const id = item?.id || item?.projectId;
      const found = selectedList?.some((selectedId) => id === selectedId);
      return found;
    });
    return fileredItems;
  }
};

// Function will return the data that needs to be passed in the End point
export const getMetricsData = (
  data,
  keys,
  globalMetricLength,
  isStages = false
) => {
  const filterSelectedData = (acc, {
    key, title, subStages, ...rest
  }) => {
    if (key > globalMetricLength && keys.includes(key)) {
      const selectedData = {
        name: title,
        ...getSubStages(isStages, subStages),
        ...rest
      };
      if (selectedData.disabled) delete selectedData.disabled;
      return [...acc, selectedData];
    }
    return acc;
  };

  const filterNotSelectedData = (acc, {
    key, title, subStages, ...rest
  }) => {
    if (!keys.includes(key)) {
      return [...acc, {
        name: title,
        ...getSubStages(isStages, subStages),
        ...rest
      }];
    }
    return acc;
  };

  return {
    selected: data.reduce(filterSelectedData, []),
    notSelected: data.reduce(filterNotSelectedData, [])
  };
};

export const getMetricsArray = (arr = []) => (arr?.length ? arr : []);

export const phoneFormat = (input) => {
  if (!input) return <IntlMessage id="component.common.notAvailable" />;
  return formatNumber(`+${input}`, 'INTERNATIONAL');
};

export const phoneisValid = ({ phone, code }) => {
  const reg = /^\d+$/;
  return !!code && phone?.length === 10 && reg.test(phone);
};

export const getFilterURI = (filterValues = {}, formattedValues = {}) => {
  const appliedFilters = { ...filterValues, ...formattedValues };
  const valueAbleKeys = Object.keys(appliedFilters)?.length
    && Object.keys(appliedFilters).filter((key) => appliedFilters[key] !== undefined);

  if (valueAbleKeys?.length) {
    const uriArr = valueAbleKeys.map((key) => `${key}|${appliedFilters[key]}`);
    return encodeURIComponent(uriArr.join('&'));
  }

  return '';
};

export const removeUndefinedProperties = (obj) => Object.fromEntries(
  Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
);

export const capitalize = (value) => (value.charAt(0).toUpperCase() + value.slice(1));

export const getRemainingLicenses = (companyData) => {
  const { totalLicenses = 0, usedLicenses = 0 } = companyData || {};
  return totalLicenses - usedLicenses;
};

export const getCardIcon = (cardType) => {
  const cardIconMapper = {
    visa: visaSvg,
    mastercard: mastercardSvg,
    americanexpress: americanexpressSvg,
    unionpay: unionpaySvg,
    jcb: jcbSvg,
    diners: dinersSvg,
    discover: discoverSvg
  };
  return cardIconMapper[cardType];
};

export const parseJiraIssues = ({ projectIssues }) => {
  const jiraIssues = {};
  let currentSprintFound = false;

  Object.entries(projectIssues || {}).forEach(([key, item]) => {
    if (key === 'Backlog') {
      jiraIssues[key] = item;
      return;
    }

    if (item.currentSprint && !currentSprintFound) {
      currentSprintFound = true;
    }

    if (currentSprintFound) {
      jiraIssues[key] = item;
    }
  });

  return jiraIssues;
};

export const parseTimelineRanges = (ranges, cadenceType = '') => {
  const newRanges = {};

  ranges?.forEach(({ name, startDate: sprintStartDate, endDate: sprintEndDate }) => {
    const startDate = moment(sprintStartDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH);
    const endDate = moment(sprintEndDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH);
    let columnName = name;
    if (cadenceType === methodologyType.SDLC_CAPS) {
      columnName = `${name} (${moment(startDate).format(DATE_FORMAT_MM_YYYY)})`;
    }
    newRanges[columnName] = {
      startDate,
      endDate
    };
  });

  return newRanges;
};

export const mergeSubStagesIntoStages = (mappingType, stages) => stages?.reduce((acc, curr) => {
  const accClone = [...acc];

  accClone.push(mapper(
    mappingType.mapping,
    curr,
    mappingType.default
  ));

  const currSubStages = curr.subStages?.map((subStage) => mapper(
    mappingType.mapping,
    { ...subStage, projectName: curr.stageName },
    mappingType.default
  )) || [];

  accClone.push(...currSubStages);

  return accClone;
}, []) || [];

export const parseMilestones = (milestones = []) => milestones.map(
  ({
    name: title, endDate, startDate, milestoneStatus
  }) => ({
    title,
    endDate: moment(endDate, DATE_FORMAT_DD_MM_YYYY_WITH_SLASH)
      .format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH),
    startDate: moment(startDate, DATE_FORMAT_DD_MM_YYYY_WITH_SLASH)
      .format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH),
    status: milestoneStatus || MILESTONES_STATUS.IN_PROGRESS.key
  })
);

const findOldestStage = (stages) => stages.reduce((prev, curr) => {
  if (!curr.startDate) {
    return prev;
  }

  const currStageStartDate = moment(curr?.startDate, DATE_FORMAT_DD_MM_YYYY);
  const prevStageStartDate = prev?.startDate
    ? moment(prev?.startDate, DATE_FORMAT_DD_MM_YYYY)
    : null;
  if (!prevStageStartDate || currStageStartDate.isBefore(prevStageStartDate)) {
    return curr;
  }
  return prev;
}, {});

export const getDateRanges = (stages = []) => {
  const oldestStage = findOldestStage(stages);
  const lastThreeMonthsDate = moment().subtract(3, 'month');

  let startDate = moment(lastThreeMonthsDate, DATE_FORMAT_DD_MM_YYYY);
  const endDate = moment().endOf('year');

  if (oldestStage.startDate) {
    const oldestStageStartDate = moment(oldestStage.startDate, DATE_FORMAT_DD_MM_YYYY);
    // Commenting this logic for now as the dependencies are not shown properly
    // if (oldestStageStartDate.isAfter(lastThreeMonthsDate)) {
    startDate = oldestStageStartDate;
    // }
  }

  return [startDate, endDate];
};

export const getColumnWidth = (cadence) => (cadence === methodologyType.SDLC_CAPS ? 60 : 80);

export const getRangeActions = (cadence) => {
  const rangeActions = {
    [methodologyType.AGILE_CAPS]: ProjectService.getProjectRanges,
    [methodologyType.SDLC_CAPS]: ProjectService.getProjectQuarters
  };
  return rangeActions[cadence];
};

export const formatSubStageDates = (subStages = []) => (
  subStages
    .map((s) => ({
      ...s,
      outlook: s?.outlook?.hex || s?.outlook,
      startDate: moment(s.startDate)
        .format(DATE_FORMAT_DD_MM_YYYY),
      endDate: moment(s.endDate)
        .format(DATE_FORMAT_DD_MM_YYYY)
    }))
);

// This function will determine if two date ranges overlaps.
export const dateRangeOverlaps = (
  aStart,
  aEnd,
  bStart,
  bEnd
) => (aStart <= bStart && bStart <= aEnd) // b starts in a
         || (aStart <= bEnd && bEnd <= aEnd) // b ends in a
         || (bStart < aStart && aEnd < bEnd); // a in b

// This function will cut too long strings and add "..."
export const textAbstract = (text, length) => {
  if (!text) {
    return '';
  }
  if (text.length <= length) {
    return text;
  }
  return `${text.substring(0, length)}...`;
};
export const routesParser = (privileges, privateRoutes, role) => {
  const result = [...privileges.reduce((acc, currentValue) => {
    const { screen } = currentValue;
    const routeData = privateRoutes[role];
    const hasRoute = routeData && routeData[screen];
    if (hasRoute) {
      const {
        path, component, subRoutes, blankRoute, order
      } = hasRoute;

      acc.push({
        key: screen, path, component, blankRoute, order
      });
      if (subRoutes && subRoutes.length > 0) {
        subRoutes?.forEach(({
          key, path: subPath, component: subComponent, blankRoute: subBlankRoute
        }) => {
          acc.push({
            key,
            path: subPath,
            component: subComponent,
            blankRoute: subBlankRoute
          });
        });
      }
    }
    return acc;
  }, [])];

  result?.sort((a, b) => {
    const entityOne = typeof a.order !== 'undefined';
    const entityTwo = typeof b.order !== 'undefined';
    return (entityTwo - entityOne) || (entityOne === true && a.order - b.order) || 0;
  });
  const DEFAULT_ROUTE = result.length > 0 ? ROUTES.PROFILE_SETTINGS : { key: '/', path: '/' };
  return [...result, DEFAULT_ROUTE];
};

export const getName = (fName, lName) => (fName ? (`${fName} `) : '') + lName;

export const setStagesDependencies = (dependencies = [], subStagesDependencies = [], projectName = '') => {
  if (dependencies.length) {
    return dependencies.map((dep) => dep.stageName);
  }

  if (subStagesDependencies.length) {
    return subStagesDependencies.map((dep) => `${projectName}-${dep.stageName}`);
  }

  return [];
};

/*
  ***FOR DONUT & LINE Chart donutAndLineChartParser***

* constantKeyValues:
  define key values paris in constants
  const keyName = { KEY_NAME: { value: "Your Legent Text", color: "#FFFF" } }.

* labelsKeyName: define the string of api key you are getting.

* numbersKeyName: define the string of api key you are getting.

* data: define the data to parse of in array of object.

*/
export const donutAndLineChartParser = (
  data,
  constantKeyValues,
  labelsKeyName,
  numbersKeyName
) => {
  const result = data?.reduce(({
    labels, series, colors, totalSum: total
  }, current) => {
    const totalSum = total + current[numbersKeyName];
    const label = current[labelsKeyName];
    const currentSeries = current[numbersKeyName];
    const { value: legendsText, color: legendsColor } = constantKeyValues[label] || {};

    if (constantKeyValues && constantKeyValues[current[labelsKeyName]]) {
      return ({
        labels: [...labels, t(legendsText)],
        series: [...series, currentSeries],
        colors: [...colors, ...(legendsColor
          ? [legendsColor] : [])],
        totalSum
      });
    }

    return ({
      labels: [label],
      series: [currentSeries],
      colors: [],
      totalSum: 0
    });
  }, {
    labels: [], series: [], colors: [], totalSum: 0
  }, []);
  return result;
};

export const donutAndLineChartParserFilteredLabels = (
  data,
  constantKeyValues,
  filteredLabels,
  labelsKeyName,
  numbersKeyName
) => {
  const filteredData = data.filter((item) => filteredLabels.includes(item[labelsKeyName]));

  return donutAndLineChartParser(filteredData, constantKeyValues, labelsKeyName, numbersKeyName);
};

export const handleUserPieChartStatistics = (data, usersCount) => {
  const { labels } = usersCount;
  const labelIndexMap = {};
  labels.forEach((label, index) => {
    labelIndexMap[label] = index;
  });
  let totalCount = 0;
  const updatedSeries = Array(labels.length).fill(0);
  data.forEach((item) => {
    const { registrationStatus, noOfUsers } = item;
    const label = t(USER_GRAPH_STATUS[registrationStatus]?.value);
    const index = labelIndexMap[label];
    if (index !== undefined) {
      updatedSeries[index] = noOfUsers;
      totalCount += noOfUsers;
    }
  });
  const updatedStats = {
    ...usersCount,
    series: updatedSeries,
    totalCount
  };
  return updatedStats;
};

export const getInvoiceData = (invoiceData) => {
  const {
    createdBy,
    firstName,
    lastName,
    email,
    address: {
      address1,
      address2,
      state,
      zip,
      phone
    } = {}
  } = invoiceData?.customer || {};

  const {
    totalAmountToBeCharged, invoiceDate
  } = invoiceData;
  const notAvailable = t('component.common.notAvailable');
  const invoicePayload = {
    invoiceDate: moment(invoiceDate?.toString()).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH)
    || notAvailable,
    address1: address1 || notAvailable,
    address2: address2 || notAvailable,
    state: state || notAvailable,
    zip: zip || notAvailable,
    createdBy: createdBy || notAvailable,
    phone: phone || notAvailable,
    totalAmountToBeCharged: totalAmountToBeCharged ? `$ ${totalAmountToBeCharged}` : notAvailable,
    firstName: firstName || notAvailable,
    lastName: lastName || notAvailable,
    email: email || notAvailable
  };
  return invoicePayload;
};

export const spaceValidator = (value) => {
  const spaces = value?.match(/^\s*/)[0];
  if (spaces) {
    return Promise.reject(new Error(t('component.common.spaces.validation.message')));
  }
  return Promise.resolve();
};

export const getSubdomain = (url) => {
  const matches = url.match(/^(https?:\/\/)?([^/]+)\//);
  if (matches && matches.length >= 3) {
    const domainParts = matches[2].split('.');
    if (domainParts.length >= 2) {
      return domainParts[0];
    }
  }
  return '';
};

export const getValueColor = (value) => {
  if (value <= 10 && value > 0) {
    return BILLING_STATUS_COLOURS.MUSTARD;
  }
  if (value <= 0) {
    return BILLING_STATUS_COLOURS.RED;
  }
  return BILLING_STATUS_COLOURS.BLUE_BASE;
};

export const getBillingText = (value) => {
  if (value < 0) {
    return t('component.admin.dashboard.text.billing.day.passed', { timeUnit: Math.abs(value) > 1 ? 'days are' : 'day is' });
  }
  if (value === 0) {
    return t('component.admin.dashboard.text.last.billing.day');
  }
  return t('component.admin.dashboard.text.days.leftIn.next.billing', { timeUnit: value > 1 ? 'Days' : 'Day' });
};

export const nextBillingCount = (nextBillingDate) => {
  const todaysDate = moment();
  const billingDate = moment(nextBillingDate);
  const remainingDays = billingDate.diff(todaysDate, 'days', true);

  if (remainingDays === 0) {
    return remainingDays - 1;
  }

  return remainingDays + 1;
};

export const conflictsStats = (monitoredStats = []) => {
  const conflictOrder = ['OPENED', 'RESOLVED', 'CANCELLED'];
  const sortedStats = [...monitoredStats]?.sort((a, b) => {
    const indexA = conflictOrder.indexOf(a.id);
    const indexB = conflictOrder.indexOf(b.id);
    return indexA - indexB;
  });

  const stats = Object.keys(CONFLICTS_VALUES).map((conflicts) => {
    const matchedConflicts = sortedStats.find((keys) => keys.id === conflicts);

    if (matchedConflicts) {
      return { label: CONFLICTS_VALUES[conflicts].label, value: matchedConflicts.count };
    }

    return CONFLICTS_VALUES[conflicts];
  });

  return stats;
};

export const fromPercentage = (percentage, total) => (percentage / 100) * total;

export const toFixedNoRounding = (n, value) => {
  // To pad or trim the number string to match the decimal scale
  const reg = new RegExp(`^-?\\d+(?:\\.\\d{0,${n}})?`, 'g');
  const convertedNumberToString = value.toString();
  const a = convertedNumberToString.match(reg)[0];
  const dot = a.indexOf('.');
  if (dot === -1) {
    // integer, insert decimal dot and pad up zeros
    return `${a}.${'0'.repeat(n)}`;
  }
  const b = n - (a.length - dot) + 1;
  return b > 0 ? a + '0'.repeat(b) : a;
};

export const hasAccessType = (accessType, targetAccessType) => accessType === targetAccessType;
