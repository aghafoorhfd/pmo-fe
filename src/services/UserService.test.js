import fetch from 'auth/FetchInterceptor';
import UserService from 'services/UserService';
import { removeItemFromLocalStorage } from 'utils/utils';
import {
  AUTH_SERVICE, VERIFY_EMAIL, FORGOT_PASSWORD, REGISTER_USER, SET_CREDENTIALS,
  LOGIN, RESET_CREDENTIALS, GLOBAL_SERVICE, USER_SERVICE, USER_PROFILE
} from 'constants/ApiConstant';

jest.mock('auth/FetchInterceptor');
jest.mock('utils/utils');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call login handler ', () => {
    UserService.login({ email: 'test@gmail.com', password: '12345678' });

    expect(fetch).toBeCalledWith({
      data: { email: 'test@gmail.com', password: '12345678' },
      method: 'post',
      url: LOGIN
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call register handler ', () => {
    UserService.register({ firstName: 'John', lastName: 'Dunk', email: 'test@gmail.com' });

    expect(fetch).toBeCalledWith({
      data: { firstName: 'John', lastName: 'Dunk', email: 'test@gmail.com' },
      method: 'POST',
      url: REGISTER_USER
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call sign out handler ', () => {
    UserService.logout();

    expect(removeItemFromLocalStorage).toHaveBeenCalledTimes(2);
    expect(removeItemFromLocalStorage).toMatchSnapshot();
  });

  it('should call forgot password handler ', () => {
    UserService.forgotPassword({ email: 'test@gmail.com' });

    expect(fetch).toBeCalledWith({
      data: { email: 'test@gmail.com' },
      method: 'POST',
      url: `${FORGOT_PASSWORD}`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call verify set password token handler ', () => {
    UserService.verifySetPasswordToken('qwertyuiopasdfghj123456sdgh');

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${VERIFY_EMAIL}?token=qwertyuiopasdfghj123456sdgh`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call set password handler ', () => {
    const data = {
      password: '123456',
      userId: 'qwertyuiopasdfghj123456sdgh',
      newUser: true
    };
    UserService.setPassword(data);

    expect(fetch).toBeCalledWith({
      data,
      method: 'post',
      url: SET_CREDENTIALS
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call set password handler with reset endpoint ', () => {
    const data = {
      password: '123456',
      userId: 'qwertyuiopasdfghj123456sdgh',
      newUser: false
    };
    UserService.setPassword(data);

    expect(fetch).toBeCalledWith({
      data,
      method: 'put',
      url: RESET_CREDENTIALS
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call getPrivileges handler ', () => {
    UserService.getPrivileges('admin');

    expect(fetch).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call getCurrentUsers handler ', () => {
    UserService.getAllUsers({ accessType: 's', registrationStatus: 's' });
    expect(fetch).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call getGlobalConfigurations endpoint ', () => {
    UserService.getGlobalConfigurations();
    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${GLOBAL_SERVICE}/configurations/project`
    });
  });
  it('should call getUsersStatistics handler ', () => {
    UserService.getUsersStatistics();

    expect(fetch).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call send invite endpoint ', () => {
    const userId = '1270d309-c262-4e3a-9c76-db6cc';
    UserService.sendInvite(userId);

    expect(fetch).toBeCalledWith({
      method: 'put',
      url: `${USER_SERVICE}/${userId}/invite`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call for user profile data', () => {
    UserService.getUserProfileData();
    expect(fetch).toBeCalledWith({
      method: 'get',
      url: USER_PROFILE
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call update password service', () => {
    UserService.updatePassword();
    expect(fetch).toBeCalledWith({
      method: 'put',
      url: `${AUTH_SERVICE}/credentials`
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call get company data ', () => {
    UserService.getCompanyData();

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${USER_SERVICE}/company`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call reject user api', () => {
    const userId = '1270d309-c262-4e3a-9c76-db6cc';

    UserService.rejectUser(userId);
    expect(fetch).toBeCalledWith({
      method: 'put',
      url: `${USER_SERVICE}/${userId}/reject`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
});
