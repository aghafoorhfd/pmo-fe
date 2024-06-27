import React from 'react';
import {
  fireEvent, screen, render, waitFor
} from '@testing-library/react';

import UserService from 'services/UserService';
import PasswordForm from '../settings-forms/PasswordForm';

const props = {
  loading: false
};

describe('Update password settings form', () => {
  test('Form should render with its input fields and buttons', () => {
    render(<PasswordForm {...props} />);

    const updatedPasswordForm = screen.getByTestId('editPasswordForm');
    const passwordField = screen.getByTestId('password');
    const rewritePasswordFiled = screen.getByTestId('rewritePassword');
    const clearButton = screen.getByTestId('clear-btn');
    const updatedPasswordButton = screen.getByTestId('updatePassword-btn');

    expect(updatedPasswordForm).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(rewritePasswordFiled).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
    expect(updatedPasswordButton).toBeInTheDocument();
  });

  test('It should call handle submit function when user clicks on update password button', () => {
    const updatePassword = jest.spyOn(UserService, 'updatePassword').mockImplementationOnce(() => {});

    render(<PasswordForm {...props} />);

    fireEvent.change(screen.getByTestId('input-password'), {
      target: { value: 'Sohaib@123' }
    });

    fireEvent.change(screen.getByTestId('input-rewritePassword'), {
      target: { value: 'Sohaib@123' }
    });

    const updatedPasswordButton = screen.getByTestId('updatePassword-btn');
    fireEvent.click(updatedPasswordButton);

    waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith({
        password: 'Sohaib@123',
        rewritePassword: 'Sohaib@123'
      });
    });
  });

  test('It should show validation error message when user did not enter any value in fields', () => {
    render(<PasswordForm {...props} />);

    const updatedPasswordButton = screen.getByTestId('updatePassword-btn');
    fireEvent.click(updatedPasswordButton);

    const passwordField = screen.getByTestId('password');
    const rewritePasswordFiled = screen.getByTestId('rewritePassword');

    waitFor(() => {
      expect(passwordField).toHaveTextContent('component.auth.inputField.validationRule.1');
      expect(passwordField).toHaveTextContent('component.auth.inputField.validationRule.7');
      expect(rewritePasswordFiled).toHaveTextContent('component.auth.inputField.validationRule.3');
    });
  });
});
