import { render, screen } from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';

import RiskImpact from '../conflict-details/RiskImpact';

const conflictImpactProps = {
  riskManagement: {
    optionsLoading: false,
    projectOptions: [],
    impactedMembersOptions: [],
    impactedTeamsOptions: [],
    conflictsDetails: []
  }
};

const props = {
  handleSubmit: jest.fn(),
  setCheckForm: jest.fn(),
  selectedTab: 'OPENED',
  isDetailsPageOpened: false
};

describe('Conflict Manager Details Impact View', () => {
  it('should render Conflict detail info correctly', () => {
    render(
      <TestProvider initialState={conflictImpactProps}>
        <RiskImpact {...props} />
      </TestProvider>
    );
    const conflictImpactForm = screen.getByTestId('conflict-notes-form');
    expect(conflictImpactForm).toBeInTheDocument();
  });
});
