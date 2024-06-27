import {
  render, screen, waitFor, fireEvent
} from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import { STATUS } from 'constants/StatusConstant';
import userEvent from '@testing-library/user-event';
import UserForm from './index';

jest.mock('antd-country-phone-input', () => ({
  ...jest.requireActual('antd-country-phone-input'),
  __esModule: true
}));

const props = {
  setVisible: jest.fn(),
  visible: true,
  isFormTouched: false,
  setIsFormTouched: jest.fn(),
  user: {
    loading: false,
    users: [],
    privileges: {},
    message: '',
    showMessage: false,
    status: STATUS.SUCCESS,
    isFormVisible: true,
    userProfile: {
      companyId: 'bc4ba09f-7fde-43c1-979f-8616e1ae0a84',
      accessType: 'SUPER_ADMIN'
    }
  },
  selectedRecord: {},
  setSelectedRecord: () => {}
};

describe('user form modal', () => {
  test('Check the form is present in the dom', () => {
    render(
      <TestProvider initialState={props}>
        <UserForm {...props} />
      </TestProvider>
    );
    const userForm = screen.getByTestId('user-form');
    expect(userForm).toBeInTheDocument();
  });
  test('Check the form fieldsfields with the fields firstName, LastName, accessType, email, phoneNumber', () => {
    render(
      <TestProvider initialState={props}>
        <UserForm {...props} />
      </TestProvider>
    );
    const firstName = screen.getByTestId('form-item-firstName');
    const lastName = screen.getByTestId('form-item-lastName');
    const accessType = screen.getByTestId('form-item-accessType');
    const email = screen.getByTestId('form-item-email');
    const phoneNumber = screen.getByTestId('form-item-number');
    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(accessType).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(phoneNumber).toBeInTheDocument();
  });
  test('It Should render modal with heading Add User also with two buttons Cancel and Ok', async () => {
    const { getByText } = render(
      <TestProvider initialState={props}>
        <UserForm {...props} />
      </TestProvider>
    );
    waitFor(() => {
      expect(getByText('component.add.user.title')).toBeInTheDocument();
      expect(getByText('OK')).toBeInTheDocument();
      expect(getByText('Cancel')).toBeInTheDocument();
    });
  });
  test('It should call handle submit when user click on Ok button', async () => {
    const { container, getByText } = render(
      <TestProvider initialState={props}>
        <UserForm {...props} />
      </TestProvider>
    );

    fireEvent.change(screen.getByTestId('form-item-firstName-inputField'), {
      target: { value: 'Sohaib' }
    });
    fireEvent.change(screen.getByTestId('form-item-lastName-inputField'), {
      target: { value: 'Farooqui' }
    });
    const combobox = screen.getByTestId('form-item-accessType-inputField');
    userEvent.click(combobox);
    const option = container.querySelector(
      '.ant-select-item .ant-select-item-option .ant-select-item-option-active'
    );
    userEvent.click(option);
    fireEvent.change(screen.getByTestId('form-item-email-inputField'), {
      target: { value: 'Sohaib@gmail.com' }
    });

    const countyCode = screen.getAllByRole('combobox');

    fireEvent.change(countyCode[1], { target: { value: 'US' } });

    fireEvent.change(document.getElementById('user-modal-form_phoneNumber'), {
      target: { value: '2345678900' }
    });

    fireEvent.click(getByText('component.common.add.label'));
  });
});
