import React from 'react';
import {
  List,
  Row,
  Col,
  Typography
} from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';
import './Styles.css';
import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';

const RisktHistory = () => {
  const {
    riskManagement: {
      conflictsHistory: { data = [] } = {}
    } = {}
  } = useSelector((state) => ({
    riskManagement: state.riskManagement
  }));

  const { Title, Text } = Typography;
  return (
    <List
      className="content-scrollable"
      itemLayout="vertical"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <Row>
            <Col sm={24} md={24} lg={12}>
              <Title className="mb-3" level={4}>
                {item?.name}
              </Title>
            </Col>
            <Col sm={24} md={24} lg={12} className="text-right">
              <Text>
                {moment(item.date, 'ddd, DD MMM YYYY h:mm:ss A Z').format(
                  DATE_FORMAT_MM_DD_YYYY_WITH_SLASH
                )}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24} lg={24}>
              {item.activity.map((activityLine) => (
                <li key={index}>
                  <Text>{activityLine}</Text>
                </li>
              ))}
            </Col>
          </Row>
        </List.Item>
      )} />
  );
};

export default RisktHistory;
