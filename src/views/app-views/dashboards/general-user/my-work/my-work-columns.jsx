import { DATE_FORMAT_MMM_DD_WITH_SPACE } from 'constants/DateConstant';
import moment from 'moment';
import i18n from 'i18next';
import { checkProjectRange } from 'utils/utils';

export const getMyWorkColumns = (ranges) => ([
  {
    title: 'Project Name',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 350
  },
  ...ranges.map(({ name, startDate, endDate }) => ({
    title: () => {
      const { t } = i18n;
      const rangeName = name?.includes(t('component.cadence.quarter.title')) ? name.split(' ').slice(1).join(' ') : name || '';
      return (
        <>
          <div className="text-center">{rangeName}</div>
          <div className="text-center font-weight-semibold">
            {moment(startDate).format(DATE_FORMAT_MMM_DD_WITH_SPACE)}
            -
            {moment(endDate).format(DATE_FORMAT_MMM_DD_WITH_SPACE)}
          </div>
        </>
      );
    },
    align: 'center',
    dataIndex: `range_${name}`,
    key: `range_${name}`,
    render: (_, record) => {
      const { resourcesDetails } = record;
      let assignedCapacity = 0;
      resourcesDetails?.forEach(({ fromDate, toDate, capacity }) => {
        if (checkProjectRange(
          startDate,
          endDate,
          fromDate,
          toDate
        )) {
          assignedCapacity += capacity;
        }
      });
      return `${assignedCapacity}%`;
    }
  }))]
);
