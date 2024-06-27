import React from 'react';
import { Spin } from 'antd';

// Helper components
import DataTable from 'components/shared-components/DataTable';
import { mockData } from 'mock/data/resourceManagerDashboardData';
import { resourceManagerDashboardColumns } from './dashboardTableColumns';

const tableLoading = {
  spinning: false,
  indicator: <Spin />
};

export default function index() {
  return (
    <DataTable
      data-i="resourceManagerDashboard"
      columns={resourceManagerDashboardColumns()}
      data={mockData}
      id="id"
      loading={tableLoading}
      showPagination
      totalElements={10} />
  );
}
