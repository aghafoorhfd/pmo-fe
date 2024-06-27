import { render } from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import ProjectHistory from '.';

const props = {
  auth: {
    userProfile: {
      firstName: 's',
      lastName: 'a'
    }
  },
  projectDetails: {
    projectList: [],
    selectedProjectDetails: {
      id: '1234567'
    }
  }
};

describe('ProjectHistory', () => {
  it('should contain project history and notes card', () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <ProjectHistory {...props} />
      </TestProvider>
    );
    expect(getByTestId('projectNotesCard')).toBeInTheDocument();
    expect(getByTestId('projectHistoryCard')).toBeInTheDocument();
    expect(getByTestId('addNotesButton')).toBeInTheDocument();
  });
});
