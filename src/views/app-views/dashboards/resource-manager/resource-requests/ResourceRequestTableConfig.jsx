import { Button } from 'antd';
import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';
import i18n from 'i18next';
import { noop } from 'lodash';
import moment from 'moment';

const { t } = i18n;
export const getColumns = (handleAssign = noop) => [
  {
    title: t('component.resource.request.column.project'),
    className: 'top-header-column',
    children: [
      {
        title: t('component.resource.request.column.name'),
        dataIndex: 'resourceTeamName',
        key: 'name',
        width: 150,
        align: 'center',
        render: (_, record) => record?.projectDetail?.projectName || ''
      },
      {
        title: t('component.resource.request.column.department'),
        dataIndex: 'department',
        key: 'department',
        width: 150,
        align: 'center',
        render: (_, record) => record?.projectDetail?.department || ''
      },
      {
        title: t('component.resource.request.column.domain'),
        dataIndex: 'domain',
        key: 'domain',
        width: 150,
        align: 'center',
        render: (_, record) => record?.projectDetail?.domain || ''
      },
      {
        title: t('component.resource.request.column.priority'),
        dataIndex: 'priority',
        key: 'priority',
        width: 110,
        align: 'center',
        render: (_, record) => {
          const { resourceRequestDetail: { priority = '' } = {} } = record;
          return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
        }
      }
    ]
  },
  {
    title: t('component.resource.request.column.resource'),
    className: 'top-header-column',
    children: [
      {
        title: t('component.resource.request.column.requested'),
        dataIndex: 'requested',
        key: 'requested',
        width: 110,
        align: 'center',
        render: (_, record) => record?.resourceRequestDetail?.resourceDiscipline || ''
      },
      {
        title: t('component.resource.request.column.capacity'),
        dataIndex: 'capacity',
        key: 'capacity',
        width: 100,
        align: 'center',
        render: (_, record) => record?.resourceRequestDetail?.capacity || ''
      }
    ]
  },
  {
    title: t('component.resource.request.column.requestTime'),
    className: 'top-header-column',
    children: [
      {
        title: t('component.resource.request.column.from'),
        dataIndex: 'from',
        key: 'from',
        width: 150,
        align: 'center',
        render: (_, record) => moment(record?.resourceRequestDetail?.fromDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH) || ''

      },
      {
        title: t('component.resource.request.column.to'),
        dataIndex: 'to',
        key: 'to',
        width: 150,
        align: 'center',
        render: (_, record) => moment(record?.resourceRequestDetail?.toDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH) || ''
      }
    ]
  },
  {
    title: t('component.resource.request.column.request'),
    className: 'top-header-column',
    children: [
      {
        title: t('component.resource.request.column.date'),
        dataIndex: 'date',
        key: 'date',
        width: 150,
        align: 'center',
        render: (_, record) => moment(record?.requestDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH) || ''

      },
      {
        title: t('component.resource.request.column.pending'),
        dataIndex: 'pending',
        key: 'pending',
        width: 110,
        align: 'center',
        render: (_, record) => {
          const requestDate = record?.requestDate;
          const currentDate = moment();
          const diff = Math.floor(currentDate.diff(moment(requestDate), 'days', true));
          if (diff === 0) return 'Today';
          if (diff < 30) {
            return `${diff} days`;
          }
          return `${Math.floor(currentDate.diff(moment(requestDate), 'months', true))} months`;
        }
      }
    ]
  },
  {
    title: t('component.table.column.actions'),
    fixed: 'right',
    className: 'top-header-column',
    children: [
      {
        key: 'assign',
        title: '',
        render: (_, record) => (
          <Button
            type="link"
            onClick={() => {
              handleAssign(record);
            }}
            data-i="assign-btn"
            id="resource-request-assign-btn">
            { t('component.resource.request.column.action.assign')}
          </Button>
        ),
        width: 100
      }]
  }
];
