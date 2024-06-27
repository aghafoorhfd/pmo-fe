import {
  render, fireEvent, screen, waitFor
} from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import * as authActions from 'store/slices/authSlice';
import LoginForm from './index';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: () => jest.fn()
}));

const initialState = {
  auth: {
    loading: false,
    message: '',
    showMessage: false,
    token: null,
    redirect: ''
  }
};

describe('Login Form View', () => {
  it('should dispatch action when SignButton is clicked', async () => {
    const showLoading = jest.spyOn(authActions, 'showLoading').mockImplementation(() => {});
    const signIn = jest.spyOn(authActions, 'signIn').mockImplementation(() => {});
    render(
      <TestProvider initialState={initialState}>
        <LoginForm />
      </TestProvider>
    );
    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'xyz@gmail.com' }
    });
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'Test@123' }
    });
    const signInBttn = screen.getByTestId('signIn-button');
    fireEvent.click(signInBttn);
    waitFor(() => {
      expect(showLoading()).toHaveBeenCalled();
      expect(signIn).toBeCalled();
    });
  });
});
