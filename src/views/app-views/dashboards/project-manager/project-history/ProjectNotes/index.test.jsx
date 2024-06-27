import {
  render
} from '@testing-library/react';
import { noop } from 'lodash';
import TestProvider from 'test-utilts/TestProvider';
import ProjectNotes from '.';

const props = {
  showProjectNotesModal: true,
  setShowProjectNotesModal: noop,
  addNewNote: noop
};

describe('ProjectNotes', () => {
  it('should contain project notes modal', () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <ProjectNotes {...props} />
      </TestProvider>
    );
    expect(getByTestId('project-notes-modal')).toBeInTheDocument();
  });
  it('should contain project notes form', () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <ProjectNotes {...props} />
      </TestProvider>
    );
    expect(getByTestId('project-notes-form')).toBeInTheDocument();
  });
});
