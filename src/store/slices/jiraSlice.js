import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ProjectService from 'services/ProjectService';
import i18n from 'i18next';
import { STATUS } from 'constants/StatusConstant';
import { RESET_SLICE } from 'store/actions/resetSlice';

const { SUCCESS, ERROR } = STATUS;
const { t } = i18n;

export const initialState = {
  loading: false,
  message: '',
  showMessage: false,
  status: '',
  authCode: {},
  callbackStatus: undefined,
  projectId: '',
  jiraPendingWorkStats: {}
};

export const addJiraItem = createAsyncThunk('projectService/addJiraItem', async ({ projectId, values }, { rejectWithValue }) => {
  try {
    return await ProjectService.addJiraItem(projectId, values);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const jiraCallback = createAsyncThunk('projectService/jiraCallback', async (data, { rejectWithValue }) => {
  try {
    const { data: projectId } = await ProjectService.jiraCallback(data);
    return projectId;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getUserPendingWorkStatistics = createAsyncThunk('projectService/getUserPendingWorkStats', async ({ projectId, projectKey }, { rejectWithValue }) => {
  try {
    const { data: { userPendingWorkStatistics } = {} } = await
    ProjectService.getUserPendingWorkStatistics(projectId, projectKey);
    return userPendingWorkStatistics;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const jiraSlice = createSlice({
  name: 'jira',
  initialState,
  reducers: {
    resetJiraStore: () => ({
      ...initialState
    }),
    setAuthCode: (state, action) => (
      {
        ...state, authCode: action.payload
      }
    ),
    hideMessage: (state) => ({
      ...state, message: '', showMessage: false, status: ''
    }),
    resetCallbackStatus: (state) => ({
      ...state, callbackStatus: undefined
    }),
    resetJiraPendingStats: (state) => ({
      ...state, jiraPendingWorkStats: {}
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(RESET_SLICE, () => (initialState)) // call on logout
      .addCase(jiraCallback.pending, (state) => ({ ...state, loading: true }))
      .addCase(jiraCallback.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        callbackStatus: true,
        projectId: action.payload
      }))
      .addCase(jiraCallback.rejected, (state, action) => ({
        ...state,
        message: action.payload,
        showMessage: true,
        loading: false,
        callbackStatus: false,
        status: ERROR
      }))
      .addCase(addJiraItem.pending, (state) => ({ ...state, loading: true }))
      .addCase(addJiraItem.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.jira.add.item.success'),
        status: SUCCESS
      }))
      .addCase(addJiraItem.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR
      }))
      .addCase(getUserPendingWorkStatistics.pending, (state) => ({ ...state, loading: true }))
      .addCase(getUserPendingWorkStatistics.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.jira.sync.success'),
        jiraPendingWorkStats: action.payload,
        status: SUCCESS
      }))
      .addCase(getUserPendingWorkStatistics.rejected, (state, action) => ({
        ...state,
        message: action.payload,
        showMessage: true,
        loading: false,
        status: ERROR
      }));
  }
});

export const {
  setAuthCode,
  hideMessage,
  resetJiraStore,
  resetCallbackStatus,
  resetJiraPendingStats
} = jiraSlice.actions;

export default jiraSlice.reducer;
