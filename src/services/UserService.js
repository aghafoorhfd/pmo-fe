import fetch from 'auth/FetchInterceptor';
import { AUTH_TOKEN } from 'constants/AuthConstant';
import { USER } from 'constants/RolesConstant';
import { removeItemFromLocalStorage } from 'utils/utils';
import {
  AUTH_SERVICE, FORGOT_PASSWORD, REGISTER_USER, VERIFY_EMAIL, SET_CREDENTIALS,
  USER_SERVICE, LOGIN, RESET_CREDENTIALS, GLOBAL_SERVICE, RESOURCE_TEAM, USER_PROFILE
} from 'constants/ApiConstant';

import { ROLES_ACCESS_TYPES, SELECTED_PACKAGE_KEY } from 'constants/MiscConstant';

const {
  CONFLICT_MANAGER, GENERAL_USER, PROJECT_MANAGER, RESOURCE_MANAGER
} = ROLES_ACCESS_TYPES;

const UserService = {
  login(data) {
    const { email, password, tenantId } = data;
    return fetch({
      url: LOGIN,
      method: 'post',
      data: { userName: email.toLowerCase(), password },
      headers: { 'X-TENANT-ID': tenantId }
    });
  },

  register(data, params) {
    const {
      tenantId, firstName, lastName, email, organizationName
    } = data;
    return fetch({
      url: REGISTER_USER,
      method: 'POST',
      data: {
        firstName, lastName, email: email.toLowerCase(), organizationName
      },
      headers: { 'X-TENANT-ID': tenantId },
      params
    });
  },

  logout() {
    const keysToRemove = [AUTH_TOKEN, USER, SELECTED_PACKAGE_KEY];
    keysToRemove.forEach((k) => removeItemFromLocalStorage(k));
  },

  forgotPassword(data) {
    const { tenantId, email } = data;
    return fetch({
      url: FORGOT_PASSWORD,
      method: 'POST',
      data: email.toLowerCase(),
      headers: { 'X-TENANT-ID': tenantId }
    });
  },

  verifySetPasswordToken(tenantId, token) {
    return fetch({
      url: `${VERIFY_EMAIL}?token=${token}`,
      method: 'get',
      headers: { 'X-TENANT-ID': tenantId }
    });
  },

  setPassword(data) {
    const { tenantId } = data;
    return fetch({
      url: data.newUser ? SET_CREDENTIALS : RESET_CREDENTIALS,
      method: data.newUser ? 'post' : 'put',
      data,
      headers: { 'X-TENANT-ID': tenantId }
    });
  },

  updatePassword(data) {
    return fetch({
      url: `${AUTH_SERVICE}/credentials`,
      method: 'put',
      data
    });
  },

  getPrivileges() {
    return fetch({
      url: `${USER_SERVICE}/privileges`,
      method: 'get'
    });
  },

  getAllUsers(accessType, registrationStatus, page, size) {
    return fetch({
      url: `${USER_SERVICE}/${page}/${size}?accessType=${accessType}&filterAnd=status%7C${registrationStatus}`,
      method: 'get'
    });
  },

  addUser(data) {
    return fetch({
      url: USER_SERVICE,
      method: 'post',
      data
    });
  },

  editUser(data) {
    return fetch({
      url: `${USER_SERVICE}/${data?.id}`,
      method: 'put',
      data
    });
  },

  getGlobalConfigurations() {
    return fetch({
      url: `${GLOBAL_SERVICE}/configurations/project`,
      method: 'get'
    });
  },

  sendInvite(userId) {
    return fetch({
      url: `${USER_SERVICE}/${userId}/invite`,
      method: 'put'
    });
  },

  getUsersStatistics(statType) {
    return fetch({
      url: `${USER_SERVICE}/category/stats?stats=${statType}`,
      method: 'get'
    });
  },

  getUsersByType(accessType) {
    return fetch({
      url: `${USER_SERVICE}?accessType=${accessType}`,
      method: 'get'
    });
  },

  getUsersList() {
    const query = new URLSearchParams();
    query.append('accessType', [
      PROJECT_MANAGER.key,
      CONFLICT_MANAGER.key,
      GENERAL_USER.key,
      RESOURCE_MANAGER.key]);
    return fetch({
      url: `${USER_SERVICE}?${query.toString()}`,
      method: 'get'
    });
  },

  getTeamNames() {
    return fetch({
      url: `${RESOURCE_TEAM}/names`,
      method: 'get'
    });
  },

  getUserProfileData() {
    return fetch({
      url: USER_PROFILE,
      method: 'get'
    });
  },

  revokeUser(userId) {
    return fetch({
      url: `${USER_SERVICE}/${userId}/revoke`,
      method: 'put'
    });
  },

  reActiveUser(userId) {
    return fetch({
      url: `${USER_SERVICE}/${userId}/reactivate`,
      method: 'put'
    });
  },

  rejectUser(userId) {
    return fetch({
      url: `${USER_SERVICE}/${userId}/reject`,
      method: 'put'
    });
  },

  getCompanyData() {
    return fetch({
      url: `${USER_SERVICE}/company`,
      method: 'get'
    });
  }

};
export default UserService;
