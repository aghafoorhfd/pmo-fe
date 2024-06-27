import {
  render, screen
} from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import { Form } from 'antd';
import { ProjectDetailsStore } from 'mock/data/projectDetailsData';
import ProjectSetupMandatory from './ProjectSetupMandatory';

describe('project details info form', () => {
  beforeEach(() => {
    render(
      <TestProvider initialState={ProjectDetailsStore}>
        <Form>
          <ProjectSetupMandatory />
        </Form>
      </TestProvider>
    );
  });

  it('It Should render project info section', () => {
    const userForm = screen.getByTestId('project-info-section');
    expect(userForm).toBeInTheDocument();
  });

  it('It Should render project details info form fields', () => {
    const projectName = screen.getByTestId('form-item-projectName');
    const projectNumber = screen.getByTestId('form-item-projectNumber');
    const overview = screen.getByTestId('form-item-overview');
    const category = screen.getByTestId('form-item-category');
    const priority = screen.getByTestId('form-item-priority');
    const department = screen.getByTestId('form-item-department');
    const theme = screen.getByTestId('form-item-theme');

    expect(projectName).toBeInTheDocument();
    expect(projectNumber).toBeInTheDocument();
    expect(overview).toBeInTheDocument();
    expect(category).toBeInTheDocument();
    expect(priority).toBeInTheDocument();
    expect(department).toBeInTheDocument();
    expect(theme).toBeInTheDocument();
  });
});
