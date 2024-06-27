import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import * as AnalyticsSlice from 'store/slices/analyticsSlice';
import ProductAdminDashboard from '../AnalyticsScreen';

const storeProps = {
  analytics: {
    loading: false,
    customersList: {
      data: {
        totalElements: 12,
        content: [
          {
            subscriptionId: '0b90b38c-46e6-40cd-b72f-05556da898c3',
            planType: 'WEB',
            customerName: 'Ishaq Bhojani',
            activatedDate: '2023-04-06',
            status: 'ACTIVE',
            billingCycle: 'Free',
            totalLicenses: 10,
            planFeatureNames: [
              'Resource Manager',
              'Corporate Profile Manager',
              'Project Manager'
            ]
          },
          {
            subscriptionId: 'b1e2c700-281b-451d-aa1b-a207caf22be5',
            planType: 'WEB',
            customerName: 'adeeb khalid',
            activatedDate: '2023-04-06',
            status: 'ACTIVE',
            billingCycle: 'Free',
            totalLicenses: 10,
            planFeatureNames: [
              'Resource Manager',
              'Corporate Profile Manager',
              'Project Manager'
            ]
          }
        ]
      }
    },
    filter: { pageNumber: 1, pageSize: 10 }
  }
};

describe('Analytics Screen', () => {
  test('Check the table in the dom', () => {
    render(
      <TestProvider initialState={storeProps}>
        <ProductAdminDashboard />
      </TestProvider>
    );

    const table = screen.getByTestId('analyticsTable');
    expect(table).toBeInTheDocument();
  });

  test('It should call switch button function toggleColumns', async () => {
    const toggleColumns = jest.fn();
    render(
      <TestProvider initialState={storeProps}>
        <ProductAdminDashboard />
      </TestProvider>
    );
    const switchButton = screen.getByTestId('switch-button');
    expect(switchButton).toBeInTheDocument();

    fireEvent.click(switchButton);

    setTimeout(() => {
      expect(toggleColumns).toHaveBeenCalled();
    }, 1000);
  });

  test('Should call filters action when user changes the page', async () => {
    const filters = jest
      .spyOn(AnalyticsSlice, 'filters')
      .mockImplementation(() => ({ pageNumber: 1, pageSize: 10 }));
    render(
      <TestProvider initialState={storeProps}>
        <ProductAdminDashboard />
      </TestProvider>
    );

    const pagesNumbers = screen.getByText('2');
    fireEvent.click(pagesNumbers);

    expect(filters).toHaveBeenCalledWith({
      pageNumber: 2,
      pageSize: 10
    });
  });
});
