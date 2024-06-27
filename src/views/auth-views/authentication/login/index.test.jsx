import { render, screen } from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import Login from './index';

const state = {
  theme: {
    currentTheme: 'light'
  },
  auth: {
    loading: false,
    message: '',
    showMessage: false,
    token: null,
    redirect: ''
  }
};

describe('Login View', () => {
  it('should render the View with the light theme', () => {
    render(
      <TestProvider initialState={state}>
        <Login />
      </TestProvider>
    );
    const container = screen.getByTestId('main-container');
    expect(container).toBeInTheDocument();
  });

  it('should render the view with dark theme', () => {
    render(
      <TestProvider initialState={{ ...state, theme: { currentTheme: 'dark' } }}>
        <Login state={state} />
      </TestProvider>
    );
    const container = screen.getByTestId('main-container');
    expect(container).toBeInTheDocument();
  });
});
