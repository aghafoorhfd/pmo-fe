import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { DATE_FORMAT_MM_DD_YYYY, DATE_FORMATE_DDD_dd_MMM_YYYY_H_MM_SS } from 'constants/DateConstant';

export const projectHistoryColumnConfig = () => {
  const { t } = useTranslation();
  const extractDateAndTime = (dateString) => {
    const parsedDateTime = moment(dateString, DATE_FORMATE_DDD_dd_MMM_YYYY_H_MM_SS);

    const extractedDate = parsedDateTime.format(DATE_FORMAT_MM_DD_YYYY);
    const extractedTime = parsedDateTime.format('hh:mm A');

    return { date: extractedDate, time: extractedTime };
  };
  return (
    [
      {
        title: t('component.resource.request.column.date'),
        dataIndex: 'date',
        key: 'date',
        width: 150,
        render: (_, record) => {
          const { date } = extractDateAndTime(record?.date);
          return date;
        }
      },
      {
        title: t('component.project.manager.time.title'),
        dataIndex: 'time',
        key: 'time',
        width: 150,
        render: (_, record) => {
          const { time } = extractDateAndTime(record?.date);
          return time;
        }
      },
      {
        title: t('component.project.manager.change.title'),
        dataIndex: 'activity',
        key: 'activity',
        width: 350
      },
      {
        title: t('component.project.manager.owner.title'),
        dataIndex: 'name',
        key: 'name',
        width: 150
      }
    ]
  );
};
