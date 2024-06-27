import {
  render, screen
} from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import * as React from 'react';
import ProjectManagerDashboard from './ProjectManagerDashboard';

const props = {
  auth: {
    userProfile: {
      id: '12',
      company: 'bc4ba09f-7fde-43c1-979f-8616e1ae0a84'
    }
  },
  projectDetails: {
    projectDetails: {
      loading: false,
      message: '',
      showMessage: false,
      configurationMetrics: {},
      generalUsers: [],
      status: 'success',
      projectList: [],
      selectedProjectDetails: ''
    }
  }
};

describe('Project Manager Dashboard', () => {
  it('should render project metrics screen correctly', () => {
    render(
      <TestProvider initialState={props}>
        <ProjectManagerDashboard {...props} />
      </TestProvider>
    );

    expect(
      screen.getByText('component.project.manager.gantt.chart1.title')
    ).toBeInTheDocument();
  });
});
