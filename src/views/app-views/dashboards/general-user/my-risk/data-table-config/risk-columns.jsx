import { Button, Tag, Tooltip } from 'antd';

import { CONFLICT_STATUS, CONFLICT_ACTIONS } from 'constants/MiscConstant';
import { getCircle, trashBin } from 'assets/svg/icon';
import i18n from 'i18next';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import moment from 'moment';
import { noop } from 'lodash';

const { t } = i18n;

const { OPENED, RESOLVED, CANCELLED } = CONFLICT_ACTIONS;

const conflictsDaysLabel = {
  [OPENED]: { label: 'table.component.column.daysOpen', key: 'daysOpen' },
  [RESOLVED]: { label: 'table.component.column.daysTaken', key: 'daysTakenToResolve' },
  [CANCELLED]: { label: 'table.component.column.daysTakenToCancel', key: 'daysTakenToCancel' }
};

export const getConflictColumns = (
  handleConflictDetails,
  selectedTab,
  showUnpinnedButton,
  unpinConflictClickHandler = noop,
  pinnedConflictLoading = false
) => [
  {
    title: t('component.general.user.conflict.table.column.project'),
    width: 200,
    dataIndex: 'projectName',
    key: 'projectName',
    ellipsis: true,
    render: (_, record) => {
      const {
        project: { projectName }
      } = record;
      return projectName;
    }
  },
  {
    title: t('component.general.user.conflict.table.column.status'),
    key: 'conflictStatus',
    width: 150,
    align: 'center',
    render: (_, record) => {
      const { conflictStatus } = record;
      const statusConfig = CONFLICT_STATUS[conflictStatus];
      return (
        <Tag
          style={{ borderRadius: '50px' }}
          bordered={false}
          color={statusConfig?.tagColor}>
          <>
            <span className="mr-1">{getCircle(statusConfig?.textColor)}</span>
            <span style={{ color: statusConfig?.textColor }}>
              {t(statusConfig?.label)}
            </span>
          </>
        </Tag>
      );
    }
  },
  {
    title: t('component.general.user.conflict.table.column.department'),
    width: 200,
    dataIndex: 'department',
    key: 'department',
    ellipsis: true,
    render: (_, record) => {
      const {
        project: { department }
      } = record;
      return department;
    }
  },
  {
    title: t('component.general.user.conflict.table.column.conflict'),
    width: 200,
    dataIndex: 'conflictName',
    key: 'conflictName',
    ellipsis: true
  },
  {
    title: t('component.conflict.manager.details.suggestedResolution'),
    width: 250,
    dataIndex: 'suggestedResolution',
    key: 'suggestedResolution',
    ellipsis: true,
    render: (_, record) => {
      const { suggestedResolution } = record;
      return (
        <Tooltip title={suggestedResolution}>{suggestedResolution}</Tooltip>
      );
    }
  },
  {
    title: t('component.general.user.conflict.table.column.severity'),
    width: 150,
    dataIndex: 'conflictSeverity',
    key: 'conflictSeverity',
    ellipsis: true
  },
  {
    title: t('component.general.user.conflict.table.column.openedBy'),
    width: 200,
    dataIndex: 'createdBy',
    key: 'createdBy',
    ellipsis: true
  },
  {
    title: t('component.general.user.conflict.table.column.dateOpened'),
    width: 200,
    key: 'createdDate',
    ellipsis: true,
    render: (_, record) => {
      const { createdDate } = record;
      return createdDate
        ? moment(createdDate).format(DATE_FORMAT_MM_DD_YYYY)
        : '';
    }
  },
  {
    title: t('component.general.user.conflict.table.column.lastUpdate'),
    width: 200,
    key: 'lastModifiedDate',
    ellipsis: true,
    render: (_, record) => {
      const { lastModifiedDate } = record;
      return lastModifiedDate
        ? moment(lastModifiedDate).format(DATE_FORMAT_MM_DD_YYYY)
        : '';
    }
  },
  {
    title: t(conflictsDaysLabel[selectedTab]?.label),
    width: 200,
    dataIndex: conflictsDaysLabel[selectedTab]?.key,
    key: conflictsDaysLabel[selectedTab]?.key,
    align: 'center',
    ellipsis: true
  },
  {
    ...(showUnpinnedButton && {
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Button disabled={pinnedConflictLoading} size="small" onClick={() => unpinConflictClickHandler(record)} icon={trashBin()}>
          {t('component.general.user.button.text.unpinRisk')}
        </Button>
      )
    })
  },
  {
    key: 'details',
    align: 'center',
    dataIndex: 'details',
    title: t('component.table.column.actions'),
    render: (_, record) => {
      const { conflictId } = record;
      return (
        <Button
          onClick={() => {
            handleConflictDetails(conflictId);
          }}
          data-i="details-btn">
          { t('table.component.column.details')}
        </Button>
      );
    },
    width: 120
  }
];
