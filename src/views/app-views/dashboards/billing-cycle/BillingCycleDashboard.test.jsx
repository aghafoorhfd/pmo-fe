import {
  render, screen, fireEvent, waitFor
} from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import BillingCycleDashboard from './BillingCycleDashboard';

test('It should be displayed on the screen', () => {
  render(<TestProvider><BillingCycleDashboard /></TestProvider>);
  const heading = screen.getByRole('button');
  expect(heading).toBeInTheDocument();
});

test('It should display the Modal when clicks on the Upgrade Package Button', () => {
  const handleClickUpgradePackage = jest.fn();
  render(<TestProvider><BillingCycleDashboard /></TestProvider>);
  const button = screen.getByTestId('upgradeButton');
  fireEvent.click(button);

  waitFor(() => {
    expect(handleClickUpgradePackage).toHaveBeenCalled();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });
});
