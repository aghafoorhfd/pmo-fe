import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import * as CustomerActivationSlice from 'store/slices/customerActivationSlice';
import ProductAdminDashboard from '../CustomerActivationScreen';

const storeProps = {
  customerActivation: {
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

describe('Customer Activation Screen', () => {
  test('Check the table in the dom', () => {
    render(
      <TestProvider initialState={storeProps}>
        <ProductAdminDashboard />
      </TestProvider>
    );

    const table = screen.getByTestId('customerActivationTable');
    expect(table).toBeInTheDocument();
  });

  test('Should call filters action when user changes the page', () => {
    const filters = jest
      .spyOn(CustomerActivationSlice, 'filters')
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
