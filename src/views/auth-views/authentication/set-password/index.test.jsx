import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Router from 'react-router-dom';
import UserService from 'services/UserService';
import TestProvider from 'test-utilts/TestProvider';
import SetPassword from './index';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: () => jest.fn()
}));

jest.mock('services/UserService');

const state = {
  theme: {
    currentTheme: 'light'
  },
  auth: {}
};

describe('Set Password View', () => {
  beforeEach(() => {
    UserService.verifySetPasswordToken.mockResolvedValue({ userId: '1233' });
    jest.spyOn(Router, 'useParams').mockReturnValue({ token: 5678 });
  });
  it('should render the screen with the light theme', async () => {
    UserService.verifySetPasswordToken.mockResolvedValue({ data: { iamId: '1233' } });

    const wrapper = ({ children }) => <TestProvider initialState={state}>{children}</TestProvider>;
    act(() => {
      render(<SetPassword />, { wrapper });
    });
    await waitFor(() => {
      expect(screen.queryByText('component.auth.cancel')).toBeInTheDocument();
    });
  });

  it('should render the screen with the dark theme', async () => {
    UserService.verifySetPasswordToken.mockResolvedValue({ data: { iamId: '1233' } });

    const wrapper = ({ children }) => (
      <TestProvider initialState={{ ...state, theme: { currentTheme: 'dark' } }}>
        {children}
      </TestProvider>
    );

    act(() => {
      render(<SetPassword />, { wrapper });
    });
    await waitFor(() => {
      expect(screen.queryByText('component.auth.cancel')).toBeInTheDocument();
    });
  });

  it('should not render the screen as token is not available ', async () => {
    const wrapper = ({ children }) => <TestProvider initialState={state}>{children}</TestProvider>;
    jest.spyOn(Router, 'useParams').mockReturnValue({ token: false });
    act(() => {
      render(<SetPassword />, { wrapper });
    });
    await waitFor(() => {
      expect(screen.queryByText('component.auth.cancel')).toBeNull();
    });
  });

  it('should not render the screen as token is not valid ', async () => {
    const wrapper = ({ children }) => <TestProvider initialState={state}>{children}</TestProvider>;
    UserService.verifySetPasswordToken.mockRejectedValue({ response: { status: 404 } });
    act(() => {
      render(<SetPassword />, { wrapper });
    });
    await waitFor(() => {
      expect(screen.queryByText('component.auth.cancel')).toBeNull();
    });
  });

  it('should not render the screen as token is not valid ', async () => {
    const wrapper = ({ children }) => <TestProvider initialState={state}>{children}</TestProvider>;
    UserService.verifySetPasswordToken.mockRejectedValue({ response: { status: 403 } });
    act(() => {
      render(<SetPassword />, { wrapper });
    });
    await waitFor(() => {
      expect(screen.queryByText('component.auth.cancel')).toBeNull();
    });
  });

  it('should render the screen and set iamId in userId', async () => {
    UserService.verifySetPasswordToken.mockResolvedValue({ data: { iamId: '1233' } });

    const wrapper = ({ children }) => <TestProvider initialState={state}>{children}</TestProvider>;
    act(() => {
      render(<SetPassword />, { wrapper });
    });
    await waitFor(() => {
      expect(screen.queryByText('component.auth.cancel')).toBeInTheDocument();
    });
  });
});
