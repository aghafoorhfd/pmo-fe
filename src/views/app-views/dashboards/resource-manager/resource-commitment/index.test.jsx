import * as React from 'react';
import { render, screen } from '@testing-library/react';

import ResourceCommitment from './index';

jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: () => <div />
}));

describe('resourceManagerDashboard screen', () => {
  it('It should render resource commitment screen with table', () => {
    render(
      <ResourceCommitment />
    );

    expect(
      screen.getAllByText('component.resource.manager.resource.commitment.availableCapacity')[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('component.resource.manager.resource.commitment.committedHours')[0]
    ).toBeInTheDocument();
  });
});
