import React from 'react';
import {
  render, screen, fireEvent, waitFor
} from '@testing-library/react';

import TestProvider from 'test-utilts/TestProvider';

import * as conflictActions from 'store/slices/riskManagementSlice';
import { riskManagementStoreProps } from './risksProps';

import RiskManagementDashboard from '../RiskManagementDashboard';

const props = {
  riskManagement: {
    loading: false
  },
  conflictDetailId: null,
  isModalOpen: false
};

describe('Conflict Manager Dashboard View', () => {
  it('Should render Conflict manager dashboard', () => {
    render(
      <TestProvider initialState={riskManagementStoreProps}>
        <RiskManagementDashboard {...props} />
      </TestProvider>
    );
    expect(screen.getByTestId('conflict-manager-dashboard-screen')).toBeInTheDocument();
  });

  it('Should render open conflict tab', () => {
    render(
      <TestProvider initialState={riskManagementStoreProps}>
        <RiskManagementDashboard {...props} />
      </TestProvider>
    );
    expect(screen.getByLabelText('component.conflict.manager.tab.openRisk')).toBeInTheDocument();
    expect(screen.getByTestId('open-conflict-tbl')).toBeInTheDocument();
  });

  it('Should render resolved tab', () => {
    render(
      <TestProvider initialState={riskManagementStoreProps}>
        <RiskManagementDashboard {...props} />
      </TestProvider>
    );
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[1]);
    expect(screen.getByLabelText('component.conflict.manager.tab.resolvedRisk')).toBeInTheDocument();
    expect(screen.getByTestId('resolved-conflict-tbl')).toBeInTheDocument();
  });

  it('Should render cancelled tab', () => {
    render(
      <TestProvider initialState={riskManagementStoreProps}>
        <RiskManagementDashboard {...props} />
      </TestProvider>
    );
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[2]);
    expect(screen.getByLabelText('component.conflict.manager.tab.cancelledRisk')).toBeInTheDocument();
    expect(screen.getByTestId('canceled-conflict-tbl')).toBeInTheDocument();
  });

  it('Should call onTabChange functions when user change the tabs', () => {
    const resetConflictAction = jest.spyOn(conflictActions, 'resetConflictStore').mockImplementation(() => {});
    render(
      <TestProvider initialState={riskManagementStoreProps}>
        <RiskManagementDashboard {...props} />
      </TestProvider>
    );

    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[1]);

    expect(resetConflictAction).toHaveBeenCalled();
  });

  it('Should show modal when user click on add new conflit button', () => {
    const { rerender } = render(
      <TestProvider initialState={riskManagementStoreProps}>
        <RiskManagementDashboard {...props} />
      </TestProvider>
    );

    const addNewConflictButton = screen.getByTestId('open-new-conflict-btn');
    fireEvent.click(addNewConflictButton);

    rerender(
      <TestProvider initialState={riskManagementStoreProps}>
        <RiskManagementDashboard {...{ ...props, isModalOpen: true, conflictDetailId: 123 }} />
      </TestProvider>
    );

    waitFor(() => {
      const headingOfModal = screen.getByText('Create New Conflict');
      expect(headingOfModal).toBeInTheDocument();
    });
  });

  it('Should show modal when user click on details button', async () => {
    const { rerender } = render(
      <TestProvider initialState={riskManagementStoreProps}>
        <RiskManagementDashboard {...props} />
      </TestProvider>
    );

    const detailsBtn = await screen.findAllByTestId('details-btn');
    fireEvent.click(detailsBtn[0]);

    rerender(
      <TestProvider initialState={riskManagementStoreProps}>
        <RiskManagementDashboard {...{ ...props, isModalOpen: true, conflictDetailId: 123 }} />
      </TestProvider>
    );

    waitFor(() => {
      const headingOfModal = screen.getByText('Create New Conflict');
      expect(headingOfModal).toBeInTheDocument();
    });
  });

  it('Should call filters action when user changes the page', async () => {
    const filters = jest.spyOn(conflictActions, 'filters').mockImplementation(() => ({ conflictStatus: 'OPENED', pageNumber: 1, pageSize: 10 }));
    render(
      <TestProvider initialState={riskManagementStoreProps}>
        <RiskManagementDashboard {...props} />
      </TestProvider>
    );

    const pagesNumbers = screen.getByText('2');
    fireEvent.click(pagesNumbers);

    expect(filters).toHaveBeenCalledWith({ conflictStatus: 'OPENED', pageNumber: 2, pageSize: 10 });
  });
});
