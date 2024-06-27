import { fireEvent, render as RTLRender, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import * as authActions from 'store/slices/authSlice';
import TestProvider from 'test-utilts/TestProvider';
import RegisterForm from './index';

const defaultProps = {
  auth: {
    loading: false,
    message: '',
    showMessage: false,
    token: null,
    redirect: ''
  }
};

const render = (props = defaultProps) => RTLRender(
  <TestProvider initialState={props}>
    <RegisterForm />
  </TestProvider>
);

describe('RegisterForm', () => {
  test('Verify All Fields are present in the dom', () => {
    render();

    expect(screen.getByTestId('firstName')).toBeInTheDocument();
    expect(screen.getByTestId('lastName')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
  });

  test('Verify on sign up functionality', async () => {
    const signUp = jest.spyOn(authActions, 'signUp').mockImplementationOnce(() => {});
    render();
    fireEvent.change(screen.getByTestId('firstName'), {
      target: { value: 'FirstName' }
    });

    fireEvent.change(screen.getByTestId('lastName'), {
      target: { value: 'LastName' }
    });

    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'email@email.com' }
    });
    const signUpButton = screen.getByTestId('sign-up');
    fireEvent.click(signUpButton);

    await act(async () => {});

    expect(signUp).toHaveBeenCalledWith({
      firstName: 'FirstName',
      lastName: 'LastName',
      email: 'email@email.com'
    });
  });
});
