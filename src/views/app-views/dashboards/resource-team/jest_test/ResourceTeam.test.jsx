import React from 'react';
import {
  fireEvent, render, screen, waitFor
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import TestProvider from 'test-utilts/TestProvider';
import ResourceTeam from '../ResourceTeam';

const props = {
  resourceTeam: {
    loading: false,
    data: [{ resourceTeamData: { content: [], totalElements: 22 } }],
    message: '',
    showMessage: false,
    totalElements: 22,
    filter: { currentPage: 1, pageLimit: 10 },
    status: 'success'
  },
  user: {
    userProfile: {
      companyId: 'abcd',
      accessType: 'SUPER_ADMIN'
    }
  }
};

const localProps = {
  selectedTeam: {},
  isModalOpen: false
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  Suspense: ({ children }) => <div>{children}</div>
}));

describe('Resource team', () => {
  test('It should render table with the headers team name, description, resource manager and team lead', async () => {
    const { container } = render(
      <TestProvider initialState={props}>
        <ResourceTeam {...localProps} />
      </TestProvider>
    );

    const getTable = await screen.findByTestId('resourceTeamTable-data-table');

    expect(getTable).toBeInTheDocument();
    const cells = container.querySelectorAll('.ant-table-cell');
    act(() => {});
    const tableHeadings = [
      'component.resource.team.table.column.teamName',
      'component.resource.team.table.column.description',
      'component.resource.team.table.column.resourceManager',
      'component.resource.team.table.column.teamLead'
    ];
    tableHeadings.forEach((header, index) => {
      expect(header).toBe(cells[index].textContent);
    });

    expect(cells[4].textContent).toBeFalsy();
    expect(cells[5].textContent).toBeFalsy();
  });

  test('Should display add resource team button check the fireEvent on it', async () => {
    const showModal = jest.fn();

    render(
      <TestProvider initialState={props}>
        <ResourceTeam {...localProps} />
      </TestProvider>
    );

    const addTeamButton = screen.getByTestId('add-team');
    expect(addTeamButton).toHaveTextContent('component.resource.team.addResourceTeam');
    fireEvent.click(addTeamButton);
    act(() => {});
    waitFor(() => {
      expect(showModal).toHaveBeenCalled();
    });
  });

  test('It should render add resource team modal when isModalOpen state gets true', async () => {
    const { rerender } = render(
      <TestProvider initialState={props}>
        <ResourceTeam {...localProps} />
      </TestProvider>
    );

    const addTeamButton = await screen.findByTestId('add-team');
    fireEvent.click(addTeamButton);

    rerender(
      <TestProvider initialState={props}>
        <ResourceTeam isModalOpen />
      </TestProvider>
    );

    await waitFor(() => {
      const title = screen.getByRole('dialog');
      expect(title).toHaveTextContent('component.resource.team.addResourceTeam');
    });
  });

  test('It should call handle change when user change the page', () => {
    const handleChange = jest.fn();

    render(
      <TestProvider initialState={props}>
        <ResourceTeam {...localProps} />
      </TestProvider>
    );
    waitFor(() => {
      const paginationButton2 = screen.getByText(2);
      fireEvent.click(paginationButton2);
    });

    act(() => {});
    waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    });
  });

  test('It Should display error messgae in antd notification modal', async () => {
    const { rerender } = render(
      <TestProvider initialState={props}>
        <ResourceTeam {...localProps} />
      </TestProvider>
    );
    const updatedProps = {
      resourceTeam: {
        loading: true,
        data: [{ resourceTeamData: { content: [], totalElements: 22 } }],
        message: 'Error messgae',
        showMessage: true,
        filter: { currentPage: 1, pageLimit: 10 },
        status: 'error'
      },
      user: {
        userProfile: {
          companyId: 'abcd',
          accessType: 'SUPER_ADMIN'
        }
      }
    };
    rerender(
      <TestProvider initialState={updatedProps}>
        <ResourceTeam {...localProps} />
      </TestProvider>
    );
    waitFor(() => {
      expect(screen.getByText('Error messgae'));
    });
  });
});
