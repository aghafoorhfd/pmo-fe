import {
  fireEvent, render, screen, waitFor
} from '@testing-library/react';
import { noop } from 'lodash';
import TestProvider from 'test-utilts/TestProvider';
import ProjectMetricsModal from '.';

const props = {
  globalData: ['a', 'b'],
  companyData: ['c', 'd'],
  metricKey: '',
  modalTitle: '',
  metricName: '',
  label: '',
  placeholder: 'component.project.projectCategories.placeholder',
  validMessage: '',
  addFormVisibility: true,
  setAddFormVisibility: noop,
  setMetricsModalVisibility: noop,
  updateProjectConfigurations: noop
};

describe('ProjectMetricsModal ', () => {
  it('should contain Modal ', () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <ProjectMetricsModal {...props} />
      </TestProvider>
    );
    const modal = getByTestId('metrics-modal');
    expect(modal).toBeInTheDocument();
  });

  it('should contain Add New Metric Button ', () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <ProjectMetricsModal {...props} />
      </TestProvider>
    );
    const addButton = getByTestId('add-new-metric-button');
    expect(addButton).toBeInTheDocument();
  });

  it('should contain Add Project Category Form ', () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <ProjectMetricsModal {...props} />
      </TestProvider>
    );
    const addButton = getByTestId('add-new-metric-button');
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);

    const addItemForm = getByTestId('add-projectCategories-form');
    const addInputfield = getByTestId('form-item-projectCategories');
    const addInputCancelBtn = getByTestId('projectCategories-form-cancel-button');
    const addInputAddBtn = getByTestId('addProjectCategories-button');

    expect(addButton).not.toBeInTheDocument();
    expect(addItemForm).toBeInTheDocument();
    expect(addInputfield).toBeInTheDocument();
    expect(addInputCancelBtn).toBeInTheDocument();
    expect(addInputAddBtn).toBeInTheDocument();
  });

  it('should contain Add Resource Type Form ', () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <ProjectMetricsModal {...props} />
      </TestProvider>
    );
    const addButton = getByTestId('add-new-metric-button');
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);

    const addItemForm = getByTestId('add-projectCategories-form');
    const addInputfield = getByTestId('form-item-projectCategories');
    const addInputCancelBtn = getByTestId('projectCategories-form-cancel-button');
    const addInputAddBtn = getByTestId('addProjectCategories-button');

    expect(addButton).not.toBeInTheDocument();
    expect(addItemForm).toBeInTheDocument();
    expect(addInputfield).toBeInTheDocument();
    expect(addInputCancelBtn).toBeInTheDocument();
    expect(addInputAddBtn).toBeInTheDocument();

    fireEvent.click(addInputCancelBtn);
    waitFor(() => {
      expect(addButton).toBeInTheDocument();
    });
    expect(addItemForm).not.toBeInTheDocument();
  });

  it('onCancel should set the ModalState false when Save button is disabled', () => {
    const { getByText, getByTestId } = render(
      <TestProvider initialState={props}>
        <ProjectMetricsModal {...props} />
      </TestProvider>
    );
    const modal = getByTestId('metrics-modal');
    expect(modal).toBeInTheDocument();
    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);
    waitFor(() => {
      expect(props.setShowCategoryModalScreen).toBeCalledWith(false);
    });
  });

  it('should contain Modal ', () => {
    const { getByText, getByTestId } = render(
      <TestProvider initialState={props}>
        <ProjectMetricsModal {...props} />
      </TestProvider>
    );
    const modal = getByTestId('metrics-modal');
    expect(modal).toBeInTheDocument();

    const addButton = getByTestId('add-new-metric-button');
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);

    const addItemForm = getByTestId('add-projectCategories-form');
    const inputField = screen.getByPlaceholderText('component.project.projectCategories.placeholder');
    const newValue = 'New Item';
    fireEvent.change(inputField, { target: { value: newValue } });

    expect(inputField.value).toBe(newValue);
    fireEvent.submit(addItemForm);
    waitFor(() => {
      expect(addItemForm).not.toBeInTheDocument();
    });

    const modalOkButton = getByText('component.common.save.label');
    expect(modalOkButton).toBeInTheDocument();
    fireEvent.click(modalOkButton);
    waitFor(() => {
      expect(props.setShowResourceTypeModalScreen).toBeCalledWith(false);
    });
  });
});
