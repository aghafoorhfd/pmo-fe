import {
  fireEvent, render, screen, waitFor
} from '@testing-library/react';
import * as authActions from 'store/slices/authSlice';
import TestProvider from 'test-utilts/TestProvider';
import { act } from 'react-dom/test-utils';
import { message } from 'antd';
import { STATUS } from 'constants/StatusConstant';
import ForgotPassword from './index';

const forgotPasswordProps = {
  auth: {
    loading: false,
    message: '',
    showMessage: false,
    token: null,
    redirect: '',
    status: STATUS.SUCCESS
  },
  theme: { currentTheme: 'light' }
};
describe('forgot-password', () => {
  test('Verify input field, back and sent button is present when screen renders', () => {
    render(
      <TestProvider initialState={forgotPasswordProps}>
        <ForgotPassword />
      </TestProvider>
    );
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('send-email-btn')).toBeInTheDocument();
    expect(screen.getByTestId('back-btn')).toBeInTheDocument();
  });
  test('It should call forgotPasswordRequest action when user clicks on sent email button', async () => {
    const sentEmail = jest
      .spyOn(authActions, 'forgotPasswordRequest')
      .mockImplementationOnce(() => {});
    render(
      <TestProvider initialState={forgotPasswordProps}>
        <ForgotPassword />
      </TestProvider>
    );
    fireEvent.change(screen.getByTestId('input-email'), {
      target: { value: 'msohaib@nisum.com' }
    });
    fireEvent.click(screen.getByTestId('send-email-btn'));
    await act(async () => {});
    expect(sentEmail).toHaveBeenCalledWith({
      email: 'msohaib@nisum.com'
    });
  });
  test('It should dispatch hideAuthMessage when sent email api gets successful', async () => {
    const sentEmail = jest
      .spyOn(authActions, 'forgotPasswordRequest')
      .mockImplementationOnce(() => {});
    jest.spyOn(authActions, 'hideAuthMessage').mockImplementationOnce(() => {});
    jest
      .spyOn(message, 'open')
      .mockImplementation(() => ({ type: 'success', content: 'Reset password link is sent on your email' }));
    const { rerender } = render(
      <TestProvider initialState={forgotPasswordProps}>
        <ForgotPassword />
      </TestProvider>
    );
    fireEvent.change(screen.getByTestId('input-email'), {
      target: { value: 'msohaib@nisum.com' }
    });
    fireEvent.click(screen.getByTestId('send-email-btn'));
    await act(async () => {});
    expect(sentEmail).toHaveBeenCalledWith({
      email: 'msohaib@nisum.com'
    });
    rerender(
      <TestProvider
        initialState={{
          ...forgotPasswordProps,
          auth: { message: 'Reset password link is sent on your email', showMessage: true, status: 'success' }
        }}>
        <ForgotPassword />
      </TestProvider>
    );
    waitFor(() => {
      expect(authActions.hideAuthMessage).toHaveBeenCalled();
    });
  });
  test('Verify send email button text', () => {
    const { rerender } = render(
      <TestProvider initialState={forgotPasswordProps}>
        <ForgotPassword />
      </TestProvider>
    );
    const btn = screen.getByTestId('send-email-btn');
    expect(btn).toHaveTextContent('component.auth.send');
    rerender(
      <TestProvider
        initialState={{
          ...forgotPasswordProps,
          auth: { loading: true }
        }}>
        <ForgotPassword />
      </TestProvider>
    );
    expect(btn).toHaveTextContent('component.auth.sending');
  });
});
