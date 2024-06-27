import {
  render, screen
} from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import { ProjectDetailsStore } from 'mock/data/projectDetailsData';
import ProjectDetailsForm from './ProjectDetailsForm';

const props = {
  handleSubmit: () => {}
};
describe('project details form', () => {
  it('Check the form is present in the dom', () => {
    render(
      <TestProvider initialState={ProjectDetailsStore}>
        <ProjectDetailsForm {...props} />
      </TestProvider>
    );
    const userForm = screen.getByTestId('project-details-form');
    expect(userForm).toBeInTheDocument();
  });

  it('It Should render project info section', () => {
    render(
      <TestProvider initialState={ProjectDetailsStore}>
        <ProjectDetailsForm {...props} />
      </TestProvider>
    );
    const userForm = screen.getByTestId('project-info-section');
    expect(userForm).toBeInTheDocument();
  });

  it('It Should render project status section', () => {
    render(
      <TestProvider initialState={ProjectDetailsStore}>
        <ProjectDetailsForm {...props} />
      </TestProvider>
    );
    const userForm = screen.getByTestId('project-status-section');
    expect(userForm).toBeInTheDocument();
  });

  it('It Should render project leads section', () => {
    render(
      <TestProvider initialState={ProjectDetailsStore}>
        <ProjectDetailsForm {...props} />
      </TestProvider>
    );
    const userForm = screen.getByTestId('project-leads-section');
    expect(userForm).toBeInTheDocument();
  });
});
