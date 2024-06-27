import React from 'react';
import {
  fireEvent, render, screen, waitFor
} from '@testing-library/react';
import ResourceManagerTeamSetup from '../resource-manager-team-setup';

const props = {
  showTeamsEditFormModal: false,
  showAddResourceFormModal: false
};

describe('resourceManagerTeamSetup screen', () => {
  test('It should render resource manager team setup screen with table', async () => {
    render(<ResourceManagerTeamSetup />);
    const table = await screen.findByTestId('resourceManagerTeam');
    expect(table).toBeInTheDocument();
  });

  test('It should render team details on screen', () => {
    const { container } = render(<ResourceManagerTeamSetup />);
    const teamDescriptions = container.querySelector('.ant-descriptions');
    expect(teamDescriptions).toBeVisible();
  });

  test('It should render add resource button inside row', () => {
    const { container } = render(<ResourceManagerTeamSetup />);
    const button = container.querySelector('.ant-row.ant-row-end.ant-row-middle .ant-btn');
    expect(button).toHaveTextContent('component.resource.team.button.addResource');
  });

  test('It should render add resource popup', async () => {
    const fn = jest.fn();
    const { rerender, container } = render(<ResourceManagerTeamSetup {...props} />);
    const addButton = await screen.findByTestId('add-resource-btn');
    fireEvent.click(addButton);
    rerender(<ResourceManagerTeamSetup {...{ ...props, showAddResourceFormModal: true }} />);
    waitFor(() => {
      const headingOfModal = screen.getByText('component.resource.add.resource.popup.title');
      expect(headingOfModal).toBeInTheDocument();
      const cancelButton = container.querySelector('.ant-modal-footer .ant-btn.ant-btn-default');
      fireEvent.click(cancelButton);
      expect(fn).toBeCalled();
    });
  });

  test('It should render edit resource team popup', async () => {
    const fn = jest.fn();
    const { rerender, container } = render(<ResourceManagerTeamSetup {...props} />);
    const editButton = await screen.findByTestId('resource-team-edit-btn');
    fireEvent.click(editButton);
    rerender(<ResourceManagerTeamSetup {...{ ...props, showTeamsEditFormModal: true }} />);
    waitFor(() => {
      const headingOfModal = screen.getByText('component.resource.team.edit.popup.title');
      expect(headingOfModal).toBeInTheDocument();
      const cancelButton = container.querySelector('.ant-modal-footer .ant-btn.ant-btn-default');
      fireEvent.click(cancelButton);
      expect(fn).toBeCalled();
    });
  });

  test('It should render team details descriptions', () => {
    const { container } = render(<ResourceManagerTeamSetup />);

    const labels = container.querySelectorAll('.ant-descriptions-item-label');

    const labelHeadings = [
      'component.resource.team.description.label.teamName',
      'component.resource.team.description.label.shortDescription',
      'component.resource.team.description.label.resourceManager',
      'component.resource.team.description.label.email',
      'component.resource.team.description.label.phone',
      'component.resource.team.description.label.teamSupervisor',
      'component.resource.team.description.label.email',
      'component.resource.team.description.label.phone',
      'component.resource.team.description.label.teamLead',
      'component.resource.team.description.label.email',
      'component.resource.team.description.label.phone'
    ];

    labelHeadings.forEach((label, index) => {
      expect(label).toBe(labels[index].textContent);
    });
  });

  test('It should render resource manager dashboard table with columns', () => {
    const { container } = render(<ResourceManagerTeamSetup />);

    const cells = container.querySelectorAll('.ant-table-cell');

    const tableHeadings = [
      'component.resource.team.resourceName',
      'component.resource.team.table.column.emailAddress',
      'component.resource.team.table.column.phone',
      'component.resource.team.resourceType',
      'component.resource.team.dailyCapacity',
      'component.resource.team.table.column.plannedVacationTime'
    ];

    tableHeadings.forEach((header, index) => {
      expect(header).toBe(cells[index].textContent);
    });
  });
});
