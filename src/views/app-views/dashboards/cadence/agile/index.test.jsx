import { fireEvent, render, waitFor } from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import Agile from '.';

const { AGILE_CAPS } = methodologyType;

const props = {
  projectDetails: {
    message: '',
    showMessage: true,
    methodologyType: AGILE_CAPS,
    status: 'success',
    projectCadence: {
      agile: {
        sprintStartDate: '2023-05-17',
        sprintDuration: 15,
        sprintName: 1,
        currentHalfSprints: [],
        sprints: [{ sprint1: { name: 'Sprint 1', startDate: '2023-02-02', endDate: '2023-03-03' } }]
      }
    },
    agileLoading: false
  }
};

describe('Agile ', () => {
  it('should render Agile Component correctly', () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <Agile {...props} />
      </TestProvider>
    );
    const AgileCard = getByTestId('agile-card');
    expect(AgileCard).toBeInTheDocument();
  });

  it('should render Sprint Datatable', () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <Agile {...props} />
      </TestProvider>
    );
    const sprintsDataTable = getByTestId('sprints-data-table');
    expect(sprintsDataTable).toBeInTheDocument();
  });

  it('should open form when edit button is clicked ', async () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <Agile {...props} />
      </TestProvider>
    );

    const editBtn = getByTestId('edit-btn');
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn);

    const AgileForm = getByTestId('agile-cadence-form');

    expect(AgileForm).toBeInTheDocument();
    expect(editBtn).not.toBeInTheDocument();

    const sprintDuration = getByTestId('sprint-duration');
    const sprintDurationInput = getByTestId('sprint-duration-input-field');
    const cancelButton = getByTestId('agile-cancel-btn');
    const saveButton = getByTestId('agile-save-btn');

    fireEvent.change(sprintDurationInput, {
      target: { value: -1 }
    });
    await waitFor(() => {
      expect(sprintDuration).toHaveTextContent('component.projectMetrics.form.validation.sprintDuration');
    });

    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(saveButton).not.toBeInTheDocument();
    expect(cancelButton).not.toBeInTheDocument();
    expect(AgileForm).not.toBeInTheDocument();
  });

  it('should open form when edit button is clicked ', async () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <Agile {...props} />
      </TestProvider>
    );

    const editBtn = getByTestId('edit-btn');
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn);

    const AgileForm = getByTestId('agile-cadence-form');

    expect(AgileForm).toBeInTheDocument();
    expect(editBtn).not.toBeInTheDocument();

    const sprintDurationInput = getByTestId('sprint-duration-input-field');
    const cancelButton = getByTestId('agile-cancel-btn');
    const saveButton = getByTestId('agile-save-btn');

    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();

    fireEvent.change(sprintDurationInput, {
      target: { value: 11 }
    });

    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(saveButton).not.toBeInTheDocument();
      expect(cancelButton).not.toBeInTheDocument();
      expect(AgileForm).not.toBeInTheDocument();
    });
  });
});
