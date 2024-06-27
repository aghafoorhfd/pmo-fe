import '@testing-library/jest-dom';

import { configure as RTLConfigure } from '@testing-library/dom';

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn()
    };
  };

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => {
    return (param) => {
      return param;
    };
  }
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key })
}));

RTLConfigure({
  testIdAttribute: 'data-i'
});
