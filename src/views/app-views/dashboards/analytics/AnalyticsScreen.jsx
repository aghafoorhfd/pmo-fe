import React, { useState, useEffect } from 'react';
import {
  DatePicker, Row, Col, Typography, Card, Spin, Switch, Select, Input
} from 'antd';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { BILLING_CYCLE_OPTIONS, PLAN_TYPE_OPTIONS, STATUS_OPTIONS } from 'constants/DropdownOptions';

// Helper components
import { getAllCustomersPlansList, filters, resetAnalyticsSlice } from 'store/slices/analyticsSlice';
import DataTable from 'components/shared-components/DataTable';
import { useTranslation } from 'react-i18next';
import Filters from 'components/common/filters/Filters';
import AppliedFilters from 'components/common/filters/AppliedFilters';
import useFilter from 'utils/hooks/useFilter';

import { getColumns } from './AnalyticsTableConfig';
import './analytics-styles.css';

export default function ProductAdminDashboard() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { RangePicker } = DatePicker;

  const [appliedFilters, clearFilters] = useFilter('analyticsFilters');

  const {
    loading,
    customersList: {
      data: { totalElements, content = [] } = {}
    },
    filter: { pageNumber, pageSize }
  } = useSelector((state) => state.analytics);

  const [diplayFeatures, setDisplayFeatures] = useState(false);

  const { Title } = Typography;

  useEffect(() => {
    dispatch(getAllCustomersPlansList());
    return () => {
      clearFilters();
      dispatch(resetAnalyticsSlice());
    };
  }, []);

  const tableLoading = {
    spinning: loading,
    indicator: <Spin />
  };

  const toggleColumns = () => {
    setDisplayFeatures(!diplayFeatures);
  };

  const handleChange = (pagination) => {
    const { uri } = appliedFilters;
    const { current, pageSize: size } = pagination;
    dispatch(filters({ pageNumber: size !== pageSize ? 1 : current, pageSize: size, uri }));
  };

  const handleSearch = () => {
    const { uri } = appliedFilters;
    dispatch(filters({
      pageNumber: 1, pageSize, uri
    }));
  };

  const handleClear = () => {
    dispatch(filters({
      pageNumber: 1, pageSize
    }));
  };

  const filterItems = () => (
    [
      {
        name: 'dateRange',
        label: t('component.resource.request.column.date'),
        colSpan: 24,
        render: () => (
          <RangePicker superNextIcon style={{ width: '100%' }} />
        ),
        formatter: (value) => value?.map((val) => moment(val).format('YYYY-MM-DD'))
      },
      {
        name: 'customer',
        label: t('component.general.user.search'),
        colSpan: 12,
        render: () => (
          <Input placeholder={t('component.analytics.placeholder.searchByName')} prefix={<SearchOutlined className="mr-0" />} />
        )
      },
      {
        name: 'status',
        label: t('component.common.status.label'),
        colSpan: 12,
        render: () => (
          <Select
            allowClear
            showSearch
            showArrow
            options={STATUS_OPTIONS}
            placeholder={t('component.common.status.label')} />
        )
      },
      {
        name: 'plan',
        label: t('component.product.admin.plan.type'),
        colSpan: 12,
        render: () => (
          <Select
            allowClear
            showSearch
            showArrow
            options={PLAN_TYPE_OPTIONS}
            placeholder={t('component.product.admin.plan.type')} />
        )
      },
      {
        name: 'planPaymentCycle',
        label: t('component.admin.billing.dashboard.table.column.billingCycle'),
        colSpan: 12,
        render: () => (
          <Select
            allowClear
            showSearch
            showArrow
            options={BILLING_CYCLE_OPTIONS}
            placeholder={t('component.admin.billing.dashboard.table.column.billingCycle')} />
        )
      }
    ]
  );

  return (
    <>
      <Row align="middle" className="ml-2 mb-3" justify="space-between">
        <Col>
          <Title className="mb-0" strong level={3}>{t('component.analytics.heading')}</Title>
        </Col>
      </Row>
      <Card className="product-admin-table-container">
        <Col className="mb-3">
          <Filters
            placement="bottomLeft"
            name="analyticsFilters"
            onSearch={handleSearch}
            onClear={handleClear}
            formItems={filterItems()} />
        </Col>
        <Col>
          <AppliedFilters
            name="analyticsFilters"
            options={{
              dateRange: { name: 'Date Range', separator: 'to' }
            }} />
        </Col>
        <Row justify="end" className="mb-2">
          <Col>
            {content?.length > 0 && (
            <>
              <span>{t('component.analytics.show.more.features')}</span>
              <Switch data-i="switch-button" onClick={toggleColumns} className="mb-1 ml-2" />
            </>
            )}
          </Col>
        </Row>
        <DataTable
          id="subscriptionId"
          data-i="analyticsTable"
          columns={getColumns(diplayFeatures)}
          bordered
          handleChange={handleChange}
          data={content}
          currentPage={pageNumber}
          pageSize={pageSize}
          loading={tableLoading}
          showPagination
          totalElements={totalElements} />
      </Card>
    </>
  );
}
