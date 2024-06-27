import { Provider } from 'react-redux';

import { BrowserRouter as Router } from 'react-router-dom';

import React from 'react';

import configureStore from 'redux-mock-store';

const mockStore = configureStore();

const TestProvider = ({ children, initialState }) => {
  const store = mockStore(initialState);
  return (
    <Provider store={store}>
      <Router>{children}</Router>
    </Provider>
  );
};

export default TestProvider;
