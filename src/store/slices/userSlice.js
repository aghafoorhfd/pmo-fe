import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RESET_SLICE } from 'store/actions/resetSlice';
import {
  initialPaginationConfiguration as defaultPagination, USER_GRAPH_STATUS,
  USER_STATS_TYPES
} from 'constants/MiscConstant';
import { STATUS } from 'constants/StatusConstant';
import i18n from 'i18next';
import UserService from '../../services/UserService';

const { UNUSED_LICENSES } = USER_GRAPH_STATUS;
const { SUCCESS, ERROR } = STATUS;
const { t } = i18n;
export const initialState = {
  userStats: [],
  userBarStats: [],
  userStatsLoading: true,
  userBarStatsLoading: true,
  companyData: [],
  loading: false,
  users: [],
  privileges: [],
  message: '',
  showMessage: false,
  status: '',
  isFormVisible: false,
  totalLicenses: 0,
  remainingLicenses: 0,
  privilegesLoading: true,
  filter: {
    pageNumber: defaultPagination.page,
    pageSize: defaultPagination.pageSize
  }
};

export const getUsers = createAsyncThunk('userService/getUsers', async (data, { rejectWithValue }) => {
  const {
    accessType, selectedTab: registrationStatus, pageNumber: page, pageSize: size
  } = data;

  try {
    const response = await UserService.getAllUsers(
      accessType,
      registrationStatus,
      page - 1,
      size
    );
    const { data: usersList } = response;
    return { usersList, page, size };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const addUser = createAsyncThunk('userService/addUser', async (data, { rejectWithValue }) => {
  try {
    return await UserService.addUser(data);
  } catch (error) {
    const { message, code } = error;

    let displayMessage;
    if (code === '1028') {
      const [, userMessage] = message.split(':');
      displayMessage = userMessage || message;
    } else {
      displayMessage = message;
    }
    const errorMessage = displayMessage || 'Something went wrong';
    return rejectWithValue(errorMessage);
  }
});

export const editUser = createAsyncThunk('userService/editUser', async (formEditValues, { rejectWithValue }) => {
  try {
    return await UserService.editUser(formEditValues);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const revokeUser = createAsyncThunk('userService/revokeUser', async (userId, { rejectWithValue }) => {
  try {
    await UserService.revokeUser(userId);
    return userId;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const reactivateUser = createAsyncThunk('userService/reactivateUser', async (userId, { rejectWithValue }) => {
  try {
    await UserService.reActiveUser(userId);
    return userId;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const rejectUser = createAsyncThunk('userService/rejectUser', async (userId, { rejectWithValue }) => {
  try {
    await UserService.rejectUser(userId);
    return userId;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const sendInvite = createAsyncThunk('userService/sendInvite', async (userId, { rejectWithValue }) => {
  try {
    await UserService.sendInvite(userId);
    return userId;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getUserLicenses = createAsyncThunk('userService/getUserLicenses', async (_, { rejectWithValue }) => {
  try {
    const response = await UserService.getCompanyData();
    const { data } = response;
    return { data };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getPrivileges = createAsyncThunk('userService/getPrivileges', async (_, { rejectWithValue }) => {
  try {
    const response = await UserService.getPrivileges();
    const {
      data: privilegesDetails
    } = response;
    return privilegesDetails;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getUserStats = createAsyncThunk('userService/getUserStats', async (remainingLicenses, { rejectWithValue }) => {
  try {
    const response = await UserService.getUsersStatistics(USER_STATS_TYPES.USER_PIE_CHART_STATS);
    const {
      data
    } = response;

    const unUsedLicenses = {
      noOfUsers: remainingLicenses,
      registrationStatus: UNUSED_LICENSES.key
    };

    const combinedData = [...data, unUsedLicenses];
    return combinedData;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getUserBarStats = createAsyncThunk('userService/getUserBarStats', async (userStats, { rejectWithValue }) => {
  try {
    const response = await UserService.getUsersStatistics(userStats);
    const {
      data
    } = response;

    return data;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInitialData: (state, action) => ({
      ...state, loading: false, privileges: [], ...action.payload
    }),
    showLoading: (state, action) => ({ ...state, loading: action.payload.loading }),
    hideUserMessage: (state) => ({
      ...state, status: '', message: '', showMessage: false
    }),
    resetStatus: (state) => ({ ...state, status: '' }),
    toggleForm: (state, action) => ({
      ...state,
      isFormVisible: typeof (action.payload) === 'boolean' ? action.payload : !state.isFormVisible
    }),
    resetPagination: (state) => ({
      ...state,
      filter: {
        pageNumber: defaultPagination.page,
        pageSize: defaultPagination.pageSize
      }
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(RESET_SLICE, () => (initialState)) // call on logout
      .addCase(getUsers.pending, (state) => ({ ...state, loading: true }))
      .addCase(getUsers.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        users: action.payload,
        filter: { pageNumber: action.payload.page, pageSize: action.payload.size }
      }))
      .addCase(getUsers.rejected, (state, action) => ({
        ...state,
        users: [],
        message: action.payload,
        showMessage: true,
        loading: false,
        status: ERROR
      }))
      .addCase(addUser.pending, (state) => ({ ...state, loading: true }))
      .addCase(addUser.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.user.dashboard.userAdded.success.message'),
        status: SUCCESS,
        isFormVisible: false,
        resourceId: action.payload?.data?.id
      }))
      .addCase(addUser.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR,
        isFormVisible: true
      }))
      .addCase(editUser.pending, (state) => ({ ...state, loading: true }))
      .addCase(editUser.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.user.dashboard.userEdit.success.message'),
        status: SUCCESS,
        isFormVisible: false
      }))
      .addCase(editUser.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR,
        isFormVisible: true
      }))
      .addCase(revokeUser.pending, (state) => ({ ...state, loading: true }))
      .addCase(revokeUser.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.user.dashboard.revoke.message'),
        status: SUCCESS,
        isFormVisible: false
      }))
      .addCase(revokeUser.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR,
        isFormVisible: true
      }))
      .addCase(reactivateUser.pending, (state) => ({ ...state, loading: true }))
      .addCase(reactivateUser.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.user.dashboard.reActivate.message'),
        status: SUCCESS,
        isFormVisible: false
      }))
      .addCase(reactivateUser.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR,
        isFormVisible: true
      }))
      .addCase(rejectUser.pending, (state) => ({ ...state, loading: true }))
      .addCase(rejectUser.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.user.dashboard.rejected.message'),
        status: SUCCESS,
        isFormVisible: false
      }))
      .addCase(rejectUser.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR,
        isFormVisible: true
      }))
      .addCase(sendInvite.pending, (state) => ({ ...state, loading: true }))
      .addCase(sendInvite.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.user.dashboard.sendInviteSuccess'),
        status: SUCCESS,
        isFormVisible: false
      }))
      .addCase(sendInvite.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR,
        isFormVisible: true
      }))
      .addCase(getUserLicenses.pending, (state) => ({
        ...state,
        loading: true
      }))
      .addCase(getUserLicenses.fulfilled, (state, { payload: { data } }) => {
        const { totalLicenses, usedLicenses } = data;
        return ({
          ...state,
          loading: false,
          totalLicenses,
          remainingLicenses: totalLicenses - usedLicenses,
          companyData: data
        });
      })
      .addCase(getUserLicenses.rejected, (state, action) => ({
        ...state,
        message: action.payload,
        showMessage: true,
        loading: false,
        status: ERROR
      }))
      .addCase(getPrivileges.pending, (state) => ({ ...state, privilegesLoading: true }))
      .addCase(getPrivileges.fulfilled, (state, action) => ({
        ...state,
        privileges: action?.payload?.privilegesDetails,
        privilegesLoading: false
      }))
      .addCase(getPrivileges.rejected, (state, action) => ({
        ...state,
        message: action.payload,
        privilegesLoading: false,
        status: ERROR,
        showMessage: true
      }))

      .addCase(getUserStats.pending, (state) => ({ ...state, userStatsLoading: true }))
      .addCase(getUserStats.fulfilled, (state, action) => ({
        ...state,
        userStats: action?.payload,
        userStatsLoading: false
      }))
      .addCase(getUserStats.rejected, (state, action) => ({
        ...state,
        message: action.payload,
        userStatsLoading: false,
        status: ERROR,
        showMessage: true
      }))
      .addCase(getUserBarStats.pending, (state) => ({ ...state, userBarStatsLoading: true }))
      .addCase(getUserBarStats.fulfilled, (state, action) => ({
        ...state,
        userBarStats: action?.payload,
        userBarStatsLoading: false
      }))
      .addCase(getUserBarStats.rejected, (state, action) => ({
        ...state,
        message: action.payload,
        userBarStatsLoading: false,
        status: ERROR,
        showMessage: true
      }));
  }
});

export const {
  showLoading, setInitialData, hideUserMessage, toggleForm, resetStatus, resetPagination
} = userSlice.actions;

export default userSlice.reducer;
