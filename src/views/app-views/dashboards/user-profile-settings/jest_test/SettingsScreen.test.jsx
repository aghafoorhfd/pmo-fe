import React from 'react';
import {
  screen, render, fireEvent, waitFor
} from '@testing-library/react';

import SettingsScreen from '../SettingsScreen';

const props = {
  openRowKey: false
};

describe('SettingsScreen', () => {
  test('Should render settings screen in dom', () => {
    render(<SettingsScreen {...props} />);
    expect(screen.getByTestId('settings-main-heading')).toHaveTextContent('component.user.profile.settings.screen.mainHeading');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByTestId('heading')).toBeInTheDocument();
    expect(screen.getByTestId('edit/close-btn')).toBeInTheDocument();
    expect(screen.getByTestId('editPasswordForm')).toBeInTheDocument();
  });

  test('Should change the Edit button text to Close when user clicks on Edit button and handleEditClick should call on it', () => {
    const handleEditClick = jest.fn();
    render(<SettingsScreen {...props} />);
    const editButton = screen.getByTestId('edit/close-btn');

    expect(editButton).toHaveTextContent('component.common.edit.label');
    fireEvent.click(editButton);
    expect(editButton).toHaveTextContent('component.conflict.manager.button.close');

    waitFor(() => {
      expect(handleEditClick).toHaveBeenCalled(1);
    });
  });
});
