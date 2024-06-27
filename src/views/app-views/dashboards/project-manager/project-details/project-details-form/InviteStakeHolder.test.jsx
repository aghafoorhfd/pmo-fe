import {
  render, screen
} from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import { ProjectDetailsStore } from 'mock/data/projectDetailsData';
import InviteStakeHolderModal from './InviteStakeHolderModal';

describe('Invite stake holder form', () => {
  it('It Should invite stakeholder form', () => {
    render(
      <TestProvider initialState={ProjectDetailsStore}>
        <InviteStakeHolderModal />
      </TestProvider>
    );
    const userForm = screen.getByTestId('form-item-invite');
    expect(userForm).toBeInTheDocument();
  });
  it('It Should render invite stakeholder form fields', () => {
    render(
      <TestProvider initialState={ProjectDetailsStore}>
        <InviteStakeHolderModal />
      </TestProvider>
    );
    const stakeholder = screen.getByTestId('form-item-invite-stakeholder');

    expect(stakeholder).toBeInTheDocument();
  });
});
