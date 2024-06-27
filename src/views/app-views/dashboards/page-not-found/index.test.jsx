import React from 'react';
import { createMemoryHistory } from 'history';

import { fireEvent, render, screen } from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';

import Index from './index';

const props = {
  theme: 'light'
};

describe('Page not found test', () => {
  test('Page not found screen should have main heading and sub heading', () => {
    render(
      <TestProvider initialState={props}>
        <Index />
      </TestProvider>
    );
    const mainHeading = screen.getByText(
      'component.page.not.found.main.heading'
    );
    expect(mainHeading).toBeInTheDocument();
    const subHeading = screen.getByText('component.page.not.found.subHeading');
    expect(subHeading).toBeInTheDocument();
  });
  test('It should redirect to the user first at / route when user clicks on back button', async () => {
    const history = createMemoryHistory();
    render(
      <TestProvider initialState={props}>
        <Index />
      </TestProvider>
    );
    const goBackButton = screen.getByTestId('go-back');
    expect(goBackButton).toHaveTextContent(
      'component.page.not.found.button.GoBack'
    );
    fireEvent.click(goBackButton);

    expect(history.location.pathname).toBe('/');
  });
});
