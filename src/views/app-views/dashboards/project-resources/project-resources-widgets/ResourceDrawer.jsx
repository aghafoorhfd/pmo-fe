import React from 'react';
import {
  Col, Divider, Drawer, Empty, Row
} from 'antd';
import '../index.css';
import { useTranslation } from 'react-i18next';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import moment from 'moment';

const ResourceDrawer = ({ open, onClose, resources }) => {
  const { t } = useTranslation();

  return (
    <Drawer
      title={resources?.length > 0 ? t('component.project.manager.resources.chart.numberOfResource', { count: resources?.length }) : t('component.project.manager.resources.chart.noResource')}
      placement="right"
      onClose={onClose}
      open={open}>
      {resources?.length > 0 ? resources.map((res) => (
        <>
          <Row className="flex-nowrap mb-1" align="middle" key={res?.resourceId} justify="space-between">
            <Col className="font-weight-semibold">
              <div className="resource-font-color-blue ">
                {`${res?.firstName} ${res?.lastName ? res.lastName : ''}`}
              </div>
              <div>{`${moment(res.fromDate).format(DATE_FORMAT_MM_DD_YYYY)} - ${moment(res.toDate).format(DATE_FORMAT_MM_DD_YYYY)}`}</div>
              <div className="font-size-sm resource-font-color-grey ">
                {res?.email}
              </div>

              <div className="font-size-sm">
                <span>
                  {`${t('component.project.manager.resources.drawer.engaged')}: `}
                </span>
                <span>
                  {res.isEngaged ? <CheckOutlined className="resource-font-color-green" />
                    : <CloseOutlined className="resource-font-color-red" />}
                </span>
              </div>
            </Col>
          </Row>
          <Row align="middle" justify="space-between">
            <Col>
              <span>{`${t('component.project.manager.resources.column.label.resourceDiscipline')}: `}</span>
              <span className="font-weight-semibold resource-font-color-blue ">{res.resourceDiscipline}</span>
            </Col>
            <Col>
              <span>{`${t('component.project.manager.resources.form.label.capacity')}: `}</span>
              <span className="font-weight-semibold resource-font-color-blue ">{res.capacity}</span>
            </Col>
          </Row>
          <Divider />
        </>
      )) : <Empty />}
    </Drawer>
  );
};

export default ResourceDrawer;
