import { render, screen } from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import RegisterOne from './index';

const state = {
  theme: {
    currentTheme: 'light'
  },
  auth: {}
};
describe('Register View', () => {
  it('should render the View with the light theme', () => {
    render(
      <TestProvider initialState={state}>
        <RegisterOne />
      </TestProvider>
    );
    const container = screen.getByTestId('register-container');
    expect(container).toBeInTheDocument();
  });

  it('should render the view with dark theme', () => {
    render(
      <TestProvider initialState={{ ...state, theme: { currentTheme: 'dark' } }}>
        <RegisterOne />
      </TestProvider>
    );
    const container = screen.getByTestId('register-container');
    expect(container).toBeInTheDocument();
  });
});
