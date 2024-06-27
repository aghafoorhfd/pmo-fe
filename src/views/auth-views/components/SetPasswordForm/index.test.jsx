import {
  fireEvent, render as RTLRender, screen, waitFor
} from '@testing-library/react';
import * as authActions from 'store/slices/authSlice';
import TestProvider from 'test-utilts/TestProvider';
import { STATUS } from 'constants/StatusConstant';
import { message } from 'antd';
import SetPasswordForm from './index';

const setPasswordFormProps = {
  auth: {
    status: STATUS.SUCCESS,
    loading: false,
    message: '',
    showMessage: false,
    token: null,
    redirect: ''
  }
};

const render = (props = setPasswordFormProps) => RTLRender(
  <TestProvider initialState={props}>
    <SetPasswordForm userId="1234567" newUser={false} />
  </TestProvider>
);

describe('SetPasswordForm', () => {
  test('Verify the fields that are present in dom', () => {
    render();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPassword')).toBeInTheDocument();
    expect(screen.getByTestId('save-btn')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
  });

  test('It should show the error message below the input fields if the password lenght less then the six digits', async () => {
    render();
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: '12345' }
    });

    await waitFor(async () => {
      const getErrorMessage = await screen.findByTestId('form-item-password');
      expect(getErrorMessage).toHaveTextContent('component.auth.inputField.validationRule.7');
    });
  });

  test('It should call savePassword when user clicks on the save button', async () => {
    const saveButton = jest.spyOn(authActions, 'savePassword').mockImplementationOnce(() => {});
    render();
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: '1234567' }
    });

    fireEvent.change(screen.getByTestId('confirmPassword'), {
      target: { value: '1234567' }
    });

    fireEvent.click(screen.getByTestId('save-btn'));

    waitFor(() => {
      expect(saveButton).toHaveBeenCalledWith({
        password: '1234567',
        userId: '1234567',
        newUser: true
      });
    });
  });

  test('It sholud show error when new password and confirm password not gets same', async () => {
    render();
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'Sohaib@123' }
    });

    fireEvent.change(screen.getByTestId('confirmPassword'), {
      target: { value: '123' }
    });

    const formItem = screen.getByTestId('form-item-confirmPassword');
    waitFor(() => {
      expect(formItem).toHaveTextContent('Password do not match!');
    });
  });

  test('It will not prompt any error if new password and confirm password are same', async () => {
    render();
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'Sohaib@123' }
    });

    fireEvent.change(screen.getByTestId('confirmPassword'), {
      target: { value: 'Sohaib@123' }
    });

    const form = screen.getByTestId('form');
    waitFor(() => {
      expect(form.getFieldValue()).toHaveBeenCalled();
    });
  });

  test('Validate the fuctions on click of save/submit button', async () => {
    render();
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'Sohaib@123' }
    });

    fireEvent.change(screen.getByTestId('confirmPassword'), {
      target: { value: 'Sohaib@123' }
    });

    const form = screen.getByTestId('form');
    fireEvent.click(screen.getByTestId('save-btn'));

    waitFor(() => {
      expect(form.onFinish()).toHaveBeenCalled();
      expect(form.validateField()).toHaveBeenCalled();
      expect(form.resetFields()).toHaveBeenCalled();
    });
  });

  test('test success messgae', async () => {
    const saveButton = jest.spyOn(authActions, 'savePassword').mockImplementationOnce(() => {});

    jest.spyOn(authActions, 'hideAuthMessage').mockImplementationOnce(() => {});
    jest
      .spyOn(message, 'open')
      .mockImplementation(() => ({ type: 'success', content: 'Set password link is sent on your email' }));
    render();
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'Sohaib@123' }
    });

    fireEvent.change(screen.getByTestId('confirmPassword'), {
      target: { value: 'Sohaib@123' }
    });

    fireEvent.click(screen.getByTestId('save-btn'));

    waitFor(() => {
      expect(saveButton).toHaveBeenCalledWith({
        password: '1234567',
        userId: '1234567',
        newUser: true
      });
    });

    const { rerender } = render();
    rerender(
      <TestProvider initialState={{ auth: { ...setPasswordFormProps.auth, showMessage: true, message: 'Set password link is sent on your email' } }}>
        <SetPasswordForm userId="1234567" newUser={false} />
      </TestProvider>
    );
    waitFor(() => {
      expect(authActions.hideAuthMessage()).toHaveBeenCalled();
    });
  });
});
