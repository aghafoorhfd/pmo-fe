import React, { useState } from 'react';
import {
  Badge, Avatar, List, Button, Popover
} from 'antd';
import {
  MailOutlined,
  BellOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import notificationData from 'assets/data/notification.data.json';
import Flex from 'components/shared-components/Flex';

const getIcon = (icon) => {
  switch (icon) {
    case 'mail':
      return <MailOutlined />;
    case 'alert':
      return <WarningOutlined />;
    case 'check':
      return <CheckCircleOutlined />;
    default:
      return <MailOutlined />;
  }
};

const getNotificationBody = (list) => (list.length > 0 ? (
  <List
    dataSource={list}
    itemLayout="horizontal"
    renderItem={(item) => (
      <List.Item className="list-clickable">
        <Flex alignItems="center">
          <div className="pr-3">
            {item.img ? (
              <Avatar src={`/img/avatars/${item.img}`} />
            ) : (
              <Avatar className={`ant-avatar-${item.type}`} icon={getIcon(item.icon)} />
            )}
          </div>
          <div className="mr-3">
            <span className="font-weight-bold text-dark">
              {item.name}
              {' '}
            </span>
            <span className="text-gray-light">{item.desc}</span>
          </div>
          <small className="ml-auto">{item.time}</small>
        </Flex>
      </List.Item>
    )}
    size="small" />
) : (
  <div className="empty-notification">
    <img alt="empty" src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg" />
    <p className="mt-3">You have viewed all notifications</p>
  </div>
));

export function NavNotification() {
  const [data, setData] = useState(notificationData);

  const notificationList = (
    <div>
      <div className="nav-notification-header d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Notification</h4>
        <Button className="text-primary" onClick={() => setData([])} size="small" type="text">
          Clear
        </Button>
      </div>
      <div className="nav-notification-body">{getNotificationBody(data)}</div>
      {data.length > 0 ? (
        <div className="nav-notification-footer">
          <a className="d-block" href="#/">
            View all
          </a>
        </div>
      ) : null}
    </div>
  );

  return (
    <Popover
      content={notificationList}
      overlayClassName="nav-notification"
      placement="bottomRight"
      title={null}
      trigger="click">
      <div className="nav-item">
        <Badge count={data.length}>
          <BellOutlined className="nav-icon mx-auto" type="bell" />
        </Badge>
      </div>
    </Popover>
  );
}

export default NavNotification;
