import {
  fireEvent, render, screen, waitFor
} from '@testing-library/react';
import React from 'react';
import TestProvider from 'test-utilts/TestProvider';
import ProjectMetricsDetails from './ProjectMetricsForm';

const props = {
  auth: {
    userProfile: {
      companyId: 'bc4ba09f-7fde-43c1-979f-8616e1ae0a84'
    }
  }
};

describe('Project Metrics Form', () => {
  it('should render project metrics form correctly', async () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <ProjectMetricsDetails {...props} />
      </TestProvider>
    );
    const metricsForm = getByTestId('metrics-form');
    expect(metricsForm).toBeInTheDocument();
  });
  it('It should show validation error message when sprint name and duration is less than 0', () => {
    render(
      <TestProvider initialState={props}>
        <ProjectMetricsDetails {...props} />
      </TestProvider>
    );

    const sprintDuration = screen.getByTestId('sprint-duration');
    const sprintName = screen.getByTestId('sprint-name');

    fireEvent.change(screen.getByTestId('sprint-duration').querySelector('input'), {
      target: { value: -1 }
    });

    fireEvent.change(screen.getByTestId('sprint-name').querySelector('input'), {
      target: { value: -1 }
    });

    waitFor(() => {
      expect(sprintDuration).toHaveTextContent('component.projectMetrics.form.validation.sprintDuration');
      expect(sprintName).toHaveTextContent('component.projectMetrics.form.validation.currentSprintName');
    });
  });

  it('It should show validation error message when sprint name and duration is greater than 100 and 10,000 respectively', () => {
    render(
      <TestProvider initialState={props}>
        <ProjectMetricsDetails {...props} />
      </TestProvider>
    );

    const sprintDuration = screen.getByTestId('sprint-duration');
    const sprintName = screen.getByTestId('sprint-name');

    fireEvent.change(screen.getByTestId('sprint-duration').querySelector('input'), {
      target: { value: 101 }
    });

    fireEvent.change(screen.getByTestId('sprint-name').querySelector('input'), {
      target: { value: 100001 }
    });

    waitFor(() => {
      expect(sprintDuration).toHaveTextContent('component.projectMetrics.form.validation.sprintDuration');
      expect(sprintName).toHaveTextContent('component.projectMetrics.form.validation.currentSprintName');
    });
  });
});
