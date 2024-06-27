import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from 'constants/StatusConstant';
import i18n from 'i18next';
import { RESET_SLICE } from 'store/actions/resetSlice';
import { find } from 'lodash';
import SubscriptionService from 'services/SubscriptionService';
import { getValueFromLocalStorage, setValuesToLocalStorage } from '../../utils/utils';
import { AUTH_TOKEN } from '../../constants/AuthConstant';
import { USER } from '../../constants/RolesConstant';
import UserService from '../../services/UserService';

const { SUCCESS, ERROR } = STATUS;
const { t } = i18n;
export const initialState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
  status: '',
  user: getValueFromLocalStorage(USER),
  token: getValueFromLocalStorage(AUTH_TOKEN),
  userProfile: {}
};

export const signIn = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const response = await UserService.login(data);
    const { access_token: token } = response.data;
    setValuesToLocalStorage(AUTH_TOKEN, token);
    return { token };
  } catch (err) {
    return rejectWithValue(err?.message || 'Error');
  }
});

export const getUserProfileData = createAsyncThunk('userService/getUserProfileData', async (data, { rejectWithValue }) => {
  try {
    const response = await UserService.getUserProfileData();
    setValuesToLocalStorage(USER, response?.data?.accessType);
    return response?.data;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const signUp = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  const {
    tenantId, firstName, lastName, email, organizationName
  } = data;
  let { planPackageId, requiredLicenses } = data;
  try {
    if (!planPackageId) {
      const response = await SubscriptionService.getPlans();
      const freeTrialPackage = find(response?.data, ['name', 'Free']);
      planPackageId = freeTrialPackage?.planPackages[0]?.id;
      requiredLicenses = freeTrialPackage?.maxLicenses;
    }

    await UserService.register({
      tenantId, firstName, lastName, email, organizationName
    }, { planPackageId, requiredLicenses });

    return t('component.auth.setPassword.link.text');
  } catch (err) {
    return rejectWithValue(err?.message || 'Something went wrong');
  }
});

export const signOut = createAsyncThunk('auth/logout', async (data) => {
  UserService.logout();
  return { data };
});

export const forgotPasswordRequest = createAsyncThunk(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await UserService.forgotPassword(data);
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || 'Something went wrong');
    }
  }
);

export const savePassword = createAsyncThunk(
  'auth/setPassword',
  async (data, { rejectWithValue }) => {
    try {
      return await UserService.setPassword(data);
    } catch (err) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticated: (state, action) => ({
      ...state, loading: false, redirect: '/', token: action.payload
    }),
    showAuthMessage: (state, action) => ({
      ...state, message: action.payload, showMessage: true, loading: false
    }),
    hideAuthMessage: (state) => ({
      ...state, message: '', showMessage: false, status: ''
    }),
    signOutSuccess: (state, { payload }) => ({
      ...state, loading: false, token: null, showMessage: !!payload, message: payload, user: null
    }),
    showLoading: (state) => ({ ...state, loading: true }),
    signInSuccess: (state, action) => ({ ...state, loading: false, token: action.payload }),
    updateRedirectURL: (state, action) => ({
      ...state, redirect: action.payload
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(RESET_SLICE, () => ({
        ...initialState,
        token: null,
        redirect: '/'
      })) // call on logout
      .addCase(getUserProfileData.pending, (state) => ({ ...state, loading: true }))
      .addCase(getUserProfileData.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        userProfile: { ...action.payload, companyId: action.payload.company },
        user: action.payload.accessType
      }))
      .addCase(getUserProfileData.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, loading: false
      }))
      .addCase(signIn.pending, (state) => ({ ...state, loading: true }))
      .addCase(signIn.fulfilled, (state, action) => {
        const { token } = action.payload;
        return {
          ...state,
          loading: false,
          token
        };
      })
      .addCase(signIn.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, loading: false
      }))
      .addCase(signOut.fulfilled, (state) => ({
        ...state, loading: false, token: null, redirect: '/'
      }))
      .addCase(signOut.rejected, (state) => ({
        ...state, loading: false, token: null, redirect: '/'
      }))
      .addCase(signUp.pending, (state) => ({ ...state, loading: true }))
      .addCase(signUp.fulfilled, (state, action) => ({
        ...state, loading: false, showMessage: true, message: action.payload, status: SUCCESS
      }))
      .addCase(signUp.rejected, (state, action) => ({
        ...state, loading: false, showMessage: true, message: action.payload, status: ERROR
      }))
      .addCase(savePassword.pending, (state) => ({ ...state, loading: true }))
      .addCase(savePassword.fulfilled, (state, { meta: { arg } }) => {
        const { newUser = false } = arg;
        return {
          ...state,
          status: SUCCESS,
          loading: false,
          showMessage: true,
          message: newUser ? t('component.auth.setPassword.success.message') : t('component.auth.resetPassword.success.message'),
          redirect: '/auth/login'
        };
      })
      .addCase(savePassword.rejected, (state, action) => ({
        ...state,
        status: ERROR,
        loading: false,
        showMessage: true,
        message: action.payload,
        redirect: '/auth/login'
      }))
      .addCase(forgotPasswordRequest.pending, (state) => ({
        ...state,
        loading: true
      }))
      .addCase(forgotPasswordRequest.fulfilled, (state) => ({
        ...state,
        status: SUCCESS,
        loading: false,
        showMessage: true,
        message: t('component.auth.resetPassword.link.text')
      }))
      .addCase(forgotPasswordRequest.rejected, (state, action) => ({
        ...state,
        status: ERROR,
        loading: false,
        showMessage: true,
        message: action.payload
      }));
  }
});

export const {
  authenticated,
  showAuthMessage,
  hideAuthMessage,
  signOutSuccess,
  showLoading,
  signInSuccess,
  updateRedirectURL
} = authSlice.actions;

export default authSlice.reducer;
