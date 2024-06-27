import {
  render, screen
} from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import { Form } from 'antd';
import { ProjectDetailsStore } from 'mock/data/projectDetailsData';
import ProjectLeads from './ProjectLeads';

describe('project details leads form', () => {
  beforeEach(() => {
    render(
      <TestProvider initialState={ProjectDetailsStore}>
        <Form>
          <ProjectLeads />
        </Form>
      </TestProvider>
    );
  });

  it('It Should render project info section', () => {
    const userForm = screen.getByTestId('project-leads-section');
    expect(userForm).toBeInTheDocument();
  });

  it('It Should render project details leads form fields', () => {
    const projectManager = screen.getByTestId('form-item-projectManager');
    const techLead = screen.getByTestId('form-item-techLead');
    const productManager = screen.getByTestId('form-item-productManager');
    const stakeHolder = screen.getByTestId('form-item-stakeHolder');

    expect(projectManager).toBeInTheDocument();
    expect(techLead).toBeInTheDocument();
    expect(productManager).toBeInTheDocument();
    expect(stakeHolder).toBeInTheDocument();
  });
});
