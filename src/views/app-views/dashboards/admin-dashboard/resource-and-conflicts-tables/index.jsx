import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  Button, Col, Row, Form, Spin, Pagination
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import DataTable from 'components/shared-components/DataTable';
import Loading from 'components/shared-components/Loading';
import { Card } from 'components/shared-components/Card';
import { filters, resetPagination } from 'store/slices/resourceTeamSlice';
import { conflictsStats } from 'utils/utils';
import { TableColumns } from './TableConfig';
import ResourceTeamForm from '../../resource-team/ResourceTeamForm';
import './index.css';

export default function TableViews(props) {
  const {
    resourceTeamLoading, resourceTeamList, monitoredStats,
    conflictStatsLoading, totalElements, pageNumber
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [isModalOpne, setIsModalOpen] = useState(false);

  const addNewTeamButton = () => (
    <Button onClick={() => setIsModalOpen(true)} type="primary" size="small" icon={<PlusOutlined />}>
      {t('component.resource.team.addResourceTeam')}
    </Button>
  );

  useEffect(() => () => {
    dispatch(resetPagination());
  }, []);

  const handleChange = (current, page) => {
    dispatch(filters({
      pageNumber: current, pageSize: page
    }));
  };

  const tableLoading = {
    spinning: resourceTeamLoading,
    indicator: <Spin />
  };

  const resourceTeamCard = () => (
    <Card
      heading={t('component.resource.team.heading')}
      actionBtn={addNewTeamButton()}
      showBorder>
      <div className="resource-and-conflict-card">
        <DataTable
          bordered
          loading={tableLoading}
          showScroll={false}
          data={resourceTeamList}
          id="id"
          className="table-header"
          columns={TableColumns()} />
        <div style={{ width: '610px' }} className="mt-3 d-flex justify-content-around">
          <Pagination
            showSizeChanger={false}
            total={totalElements}
            current={pageNumber}
            pageSize={3}
            onChange={handleChange} />
        </div>
      </div>
    </Card>
  );

  const conflictStatsCard = () => (
    <Card
      heading={t('component.admin.dashboard.conflicts&Risks')}
      showBorder>
      <div className="pt-1 resource-and-conflict-card">
        {!conflictStatsLoading && conflictsStats(monitoredStats)?.length > 0 ? (
          conflictsStats(monitoredStats)?.map((conflicts) => (
            <Row className="conflict-row" key={conflicts?.label?.props?.id}>
              <Col
                className="conflict-col-left pl-3 border-top-0"
                key={conflicts?.label?.props?.id}
                xs={24}
                sm={12}
                md={8}
                lg={6}>
                {conflicts?.label}
              </Col>
              <Col className="conflict-col-right pl-3 border-top-0" key={conflicts.value + 1} xs={24} sm={12} md={8} lg={8}>
                {conflicts?.value}
              </Col>
            </Row>
          ))) : (<Loading />)}
      </div>
    </Card>
  );

  return (
    <Row gutter={[16, 4]}>
      <Col span={12}>
        {resourceTeamCard()}
      </Col>
      <Col span={12}>
        {conflictStatsCard()}
      </Col>
      {isModalOpne && (
      <ResourceTeamForm
        form={form}
        isModalOpen={isModalOpne}
        setIsModalOpen={setIsModalOpen}
        isAdminDashboard />
      )}
    </Row>
  );
}
