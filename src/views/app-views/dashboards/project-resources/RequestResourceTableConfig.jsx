import { Button } from 'antd';
import { REQUEST_STATUS } from 'constants/MiscConstant';
import i18n from 'i18next';
import { noop } from 'lodash';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import moment from 'moment';

const { t } = i18n;
const { IN_PROGRESS, REJECTED } = REQUEST_STATUS;

export const getResourceRequestColumns = (type, handleWithdrawRequest = noop) => {
  const columns = [
    {
      key: 'resourceTeam',
      dataIndex: 'resourceTeamName',
      title: t('component.project.manager.resources.column.label.resourceTeam')
    },
    {
      key: 'resourceDiscipline',
      dataIndex: ['resourceRequestDetail', 'resourceDiscipline'],
      title: t('component.project.manager.resources.column.label.resourceDiscipline')
    },
    {
      key: 'priority',
      dataIndex: ['resourceRequestDetail', 'priority'],
      title: t('component.project.manager.resources.column.label.priority'),

      render: (_, record) => {
        const { resourceRequestDetail: { priority = '' } = {} } = record;
        return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
      }
    },
    {
      key: 'capacity',
      dataIndex: ['resourceRequestDetail', 'capacity'],
      title: t('component.project.manager.resources.column.label.capacity')
    },
    {
      key: 'dateFrom',
      title: t('component.project.manager.resources.column.label.dateFrom'),
      render: (_, record) => {
        const { resourceRequestDetail: { fromDate } = {} } = record;
        return fromDate ? moment(fromDate).format(DATE_FORMAT_MM_DD_YYYY) : '';
      }
    },
    {
      key: 'dateTo',
      title: t('component.project.manager.resources.column.label.dateTo'),
      render: (_, record) => {
        const { resourceRequestDetail: { toDate } = {} } = record;
        return toDate ? moment(toDate).format(DATE_FORMAT_MM_DD_YYYY) : '';
      }
    }
  ];
  if (type === IN_PROGRESS) {
    columns.push({
      key: 'action',
      dataIndex: 'action',
      title: t('component.table.column.actions'),
      align: 'center',
      render: (_, record) => (
        <Button
          type="link"
          className="p-0"
          onClick={() => {
            handleWithdrawRequest(record?.resourceRequestId);
          }}
          id="project-resource-withdraw-req-btn">
          {t('component.project.manager.resources.column.label.withDrawRequest')}
        </Button>
      ),
      fixed: 'right'
    });
  }

  if (type === REJECTED) {
    columns.push({
      key: 'rejectReason',
      dataIndex: 'rejectReason',
      title: t('component.project.manager.resources.column.label.reason')
    });
  }
  return columns;
};
