import {
  Button, Tag, Menu
} from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import {
  INVITATION_STATUS,
  ROLES_ACCESS_TYPES,
  USER_REGISTRATION_STATUS,
  USER_DASHBOARD_ACTIONS,
  USER_DASHBOARD_TABS
} from 'constants/MiscConstant';
import { antdTableSorter, phoneFormat } from 'utils/utils';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import {
  CheckOutlined, CloseOutlined, EditOutlined
} from '@ant-design/icons';
import { noop } from 'lodash';
import i18n from 'i18next';

const { t } = i18n;
export const getUsersColumns = (sortedInfo = { columnKey: '', order: '' }, handleAction = noop, selectedTab = '') => [
  {
    title: <IntlMessage id="component.table.column.name" />,
    dataIndex: 'firstName',
    key: 'firstName',
    render: (_, record) => {
      const fName = record.firstName || '';
      const lName = record.lastName || '';
      return (
        <span>
          {(fName ? (`${fName} `) : '') + lName}
          <br />
          <small>{record?.email}</small>
        </span>
      );
    },
    sorter: (a, b) => antdTableSorter(a, b, 'firstName'),
    sortOrder: sortedInfo.columnKey === 'firstName' && sortedInfo.order,
    ellipsis: true
  },
  {
    title: <IntlMessage id="component.table.column.accessType" />,
    dataIndex: 'accessTypeName',
    key: 'accessTypeName',
    sorter: (a, b) => antdTableSorter(a, b, 'accessTypeName'),
    sortOrder: sortedInfo.columnKey === 'accessTypeName' && sortedInfo.order
  },
  {
    title: <IntlMessage id="component.table.column.phone" />,
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    width: 220,
    render: (text) => phoneFormat(text)
  },
  {
    title: <IntlMessage id="component.common.status.label" />,
    key: 'registrationStatus',
    width: 200,
    align: 'center',
    render: (_, record) => {
      const statusConfig = USER_REGISTRATION_STATUS[record.registrationStatus];
      const getCircle = (fill) => (
        <svg viewBox="0 0 20 20" width="8px" height="8px" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="10" fill={fill} />
        </svg>
      );
      return (
        <Tag
          style={{ borderRadius: '50px' }}
          color={statusConfig?.tagColor}>
          <>
            <span className="mr-1">
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
    title: <IntlMessage id="component.table.column.invite" />,
    dataIndex: 'invitationStatus',
    key: 'invitationStatus',
    width: 150,
    align: 'center',
    render: (text, record) => (
      <Button
        disabled={record?.accessType === ROLES_ACCESS_TYPES.SUPER_ADMIN.key || record.hasPassword
          || selectedTab === USER_DASHBOARD_TABS.CURRENT_USERS
          || selectedTab === USER_DASHBOARD_TABS.REVOKED}
        type="link"
        onClick={() => {
          handleAction(USER_DASHBOARD_ACTIONS.SEND_INVITE, record);
        }}>
        {!record.hasPassword ? INVITATION_STATUS.INVITATION_SENT : INVITATION_STATUS[text]}
      </Button>
    )
  }
];

export const getCurrentUserActions = (handleAction = noop, accessType = null) => ({
  title: <IntlMessage id="component.table.column.actions" />,
  key: 'actions',
  align: 'center',
  render: (_, record) => {
    const { accessType: recordAccessType } = record;
    let enableAction = false;

    if (accessType === ROLES_ACCESS_TYPES.SUPER_ADMIN.key) {
      // Super Admin can edit & revoke all the users
      enableAction = true;
      if (recordAccessType === ROLES_ACCESS_TYPES.SUPER_ADMIN.key) {
        // Super Admin can edit & revoke itself
        enableAction = false;
      }
    } else if (accessType === ROLES_ACCESS_TYPES.ADMIN.key) {
      // Admin can edit & revoke RM, PM & GU only.
      enableAction = true;
      if (recordAccessType === ROLES_ACCESS_TYPES.SUPER_ADMIN.key
        || recordAccessType === ROLES_ACCESS_TYPES.ADMIN.key) {
        // Admin can not edit & revoke super admin and other admins
        enableAction = false;
      }
    }
    return (
      recordAccessType === ROLES_ACCESS_TYPES.SUPER_ADMIN.key ? null
        : (
          <EllipsisDropdown
            icon={<EditOutlined />}
            menu={(
              <Menu onClick={({ key }) => {
                handleAction(key, record);
              }}>

                <Menu.Item key={USER_DASHBOARD_ACTIONS.EDIT_USER} disabled={!enableAction} id="edit-user-option">
                  <IntlMessage id="component.common.edit.label" />
                </Menu.Item>
                {(record?.registrationStatus !== USER_REGISTRATION_STATUS.ACTIVE.key) && (
                  <Menu.Item key={USER_DASHBOARD_ACTIONS.GRANT_ACCESS} disabled={!enableAction} id="grant-access-option">
                    <IntlMessage id="component.table.column.grantAccess" />
                  </Menu.Item>
                )}
                {(record?.registrationStatus !== USER_REGISTRATION_STATUS.REVOKED.key) && (
                  <Menu.Item key={USER_DASHBOARD_ACTIONS.REVOKE_ACCESS} disabled={!enableAction} id="revoke-user-option">
                    <IntlMessage id="component.table.column.revoke" />
                  </Menu.Item>
                )}
              </Menu>
            )} />
        )
    );
  }

});

export const getPendingUserActions = (handleAction = noop) => ({
  title: <IntlMessage id="component.table.column.actions" />,
  key: 'actions',
  align: 'center',
  width: 250,
  render: (_, record) => (record?.registrationStatus === USER_REGISTRATION_STATUS.PENDING.key ? (
    <div>
      <CloseOutlined style={{ color: '#D92D20' }} className="font-size-lg mr-4 ml-3" onClick={() => handleAction(USER_DASHBOARD_ACTIONS.REQUEST_REJECT, record)} />
      <CheckOutlined style={{ color: '#12B76A' }} className="font-size-lg mr-4 ml-3" onClick={() => handleAction(USER_DASHBOARD_ACTIONS.REQUEST_APPROVE, record)} />
    </div>
  ) : null)
});
