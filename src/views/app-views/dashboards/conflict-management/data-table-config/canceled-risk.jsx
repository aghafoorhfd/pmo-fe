import { Button, Tag } from 'antd';
import { CONFLICT_STATUS } from 'constants/MiscConstant';
import i18n from 'i18next';
import { getCircle } from 'assets/svg/icon';
import moment from 'moment';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';

const { t } = i18n;

export const getCanceledConflictColumns = (handleConflictDetails) => [
  {
    key: 'projectName',
    dataIndex: 'projectName',
    title: t('table.component.column.project'),
    width: 220,
    render: (_, record) => record.project.projectName
  },
  {
    key: 'conflictStatus',
    align: 'center',
    dataIndex: 'conflictStatus',
    title: t('component.common.status.label'),
    width: 130,
    render: (_, record) => {
      const { conflictStatus } = record;
      const statusConfig = CONFLICT_STATUS[conflictStatus];
      return (
        <Tag
          style={{ borderRadius: '50px' }}
          bordered={false}
          color={statusConfig?.tagColor}>
          <>
            <span className="mr-1 pr-0">
              {getCircle(statusConfig?.textColor)}
            </span>
            <span style={{ color: statusConfig?.textColor }}>
              {t(statusConfig?.label)}
            </span>
          </>
        </Tag>
      );
    }
  },
  {
    key: 'department',
    dataIndex: 'department',
    title: t('table.component.column.department'),
    width: 220,
    render: (_, record) => record.project.department
  },
  {
    key: 'domain',
    dataIndex: 'domain',
    title: t('table.component.column.domain'),
    width: 180,
    render: (_, record) => record.project.category
  },
  {
    key: 'conflictName',
    dataIndex: 'conflictName',
    title: t('component.general.user.conflict.table.column.conflict'),
    width: 220
  },
  {
    key: 'conflictSeverity',
    dataIndex: 'conflictSeverity',
    title: t('table.component.column.severity'),
    width: 120
  },
  {
    key: 'daysTakenToCancel',
    dataIndex: 'daysTakenToCancel',
    title: t('table.component.column.daysTakenToCancel'),
    align: 'center',
    width: 169
  },
  {
    key: 'createdDate',
    dataIndex: 'createdDate',
    title: t('table.component.column.dateOpened'),
    width: 120,
    render: (_, record) => {
      const { project: { createdDate } = {} } = record;
      return createdDate ? moment(createdDate).format(DATE_FORMAT_MM_DD_YYYY) : '';
    }
  },
  {
    key: 'lastUpdatedBy',
    dataIndex: 'lastUpdatedBy',
    title: t('table.component.column.canceledBy'),
    width: 220
  },
  {
    key: 'details',
    align: 'center',
    dataIndex: 'details',
    title: t('component.table.column.actions'),
    render: (_, record) => {
      const { conflictId } = record;
      return (
        <Button onClick={() => { handleConflictDetails(conflictId); }}>
          {t('table.component.column.details')}
        </Button>
      );
    },
    width: 120
  }
];
