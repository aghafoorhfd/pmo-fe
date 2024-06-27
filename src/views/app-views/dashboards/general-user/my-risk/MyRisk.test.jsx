import React from 'react';
import {
  render, screen, fireEvent, waitFor
} from '@testing-library/react';

import TestProvider from 'test-utilts/TestProvider';
import MyRisks from './MyRisks';

const props = {
  riskManagement: {
    loading: false
  },
  conflictDetailId: null,
  isModalOpen: false
};

describe('My Conflicts View', () => {
  it('Should render My Conflicts', () => {
    render(
      <TestProvider initialState={props}>
        <MyRisks {...props} />
      </TestProvider>
    );
    expect(screen.getByTestId('my-conflicts-tbl')).toBeInTheDocument();
  });

  it('Should show modal when user click on details button', async () => {
    const { rerender } = render(
      <TestProvider initialState={props}>
        <MyRisks {...props} />
      </TestProvider>
    );

    const detailsBtn = await screen.findAllByTestId('details-btn');
    fireEvent.click(detailsBtn[0]);

    rerender(
      <TestProvider initialState={props}>
        <MyRisks {...{ ...props, isModalOpen: true, conflictDetailId: 123 }} />
      </TestProvider>
    );

    waitFor(() => {
      const headingOfModal = screen.getByText('table.component.column.details');
      expect(headingOfModal).toBeInTheDocument();
    });
  });
});
