import React from 'react';
import { render, screen } from '@testing-library/react';

import ResourceManagerDashboard from '../resource-manager-dashboard/index';

describe('resourceManagerDashboard screen', () => {
  test('It should render resource manager dashboard screen with table', async () => {
    render(<ResourceManagerDashboard />);
    const table = await screen.findByTestId('resourceManagerDashboard');
    expect(table).toBeInTheDocument();
  });

  test('It should render resource manager dashboard table with columns', () => {
    const { container } = render(<ResourceManagerDashboard />);

    const cells = container.querySelectorAll('.ant-table-cell');

    const tableHeadings = [
      'component.resource.team.table.column.teamName',
      'component.resource.team.table.column.description',
      'component.resource.team.table.column.assignedResources',
      'component.resource.team.table.column.resourceManager',
      'component.resource.team.table.column.teamLead'
    ];

    tableHeadings.forEach((header, index) => {
      expect(header).toBe(cells[index].textContent);
    });
  });
});
