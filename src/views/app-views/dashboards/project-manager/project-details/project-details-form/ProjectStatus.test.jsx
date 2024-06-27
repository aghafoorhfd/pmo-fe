import {
  render, screen
} from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import { Form } from 'antd';
import { ProjectDetailsStore } from 'mock/data/projectDetailsData';
import ProjectSetupMandatory from './ProjectSetupMandatory';

describe('project details status form', () => {
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
    const userForm = screen.getByTestId('project-status-section');
    expect(userForm).toBeInTheDocument();
  });

  it('It Should render project details status form fields', () => {
    const currentStatus = screen.getByTestId('form-item-currentStatus');
    const outlook = screen.getByTestId('form-item-outlook');
    const outlookReason = screen.getByTestId('form-item-outlookReason');
    const currentStage = screen.getByTestId('form-item-currentStage');
    const currentState = screen.getByTestId('form-item-currentState');

    expect(currentStatus).toBeInTheDocument();
    expect(outlook).toBeInTheDocument();
    expect(outlookReason).toBeInTheDocument();
    expect(currentStage).toBeInTheDocument();
    expect(currentState).toBeInTheDocument();
  });
});
