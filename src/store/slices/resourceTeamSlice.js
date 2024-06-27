import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { initialPaginationConfiguration as defaultPagination, DESIGNATION_TYPES } from 'constants/MiscConstant';
import { RESET_SLICE } from 'store/actions/resetSlice';
import { STATUS } from 'constants/StatusConstant';
import i18n from 'i18next';
import ResourceService from 'services/ResourceService';

const { SUCCESS, ERROR } = STATUS;
const { t } = i18n;
export const initialState = {
  loading: false,
  fromLoading: false,
  data: [],
  message: '',
  showMessage: false,
  usersList: [],
  isResourceDataFetched: false,
  filter: {
    pageNumber: defaultPagination.page,
    pageSize: defaultPagination.pageSize
  },
  status: SUCCESS
};

export const getResourceTeamList = createAsyncThunk('resourceService/getResourceTeamList', async (data, { rejectWithValue }) => {
  const { pageNumber, pageSize } = initialState.filter;
  try {
    const response = await ResourceService.getResourceTeamList(
      pageNumber - 1,
      pageSize
    );
    const { data: resourceTeamData } = response;
    return { resourceTeamData };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getResourceTeamNames = createAsyncThunk('resourceService/getResourceTeamNames', async (data, { rejectWithValue }) => {
  try {
    const response = await ResourceService.getResourceTeamNames();
    const { data: resourceTeamData } = response;
    return resourceTeamData;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getResourceTeamById = createAsyncThunk('resourceService/getResourceTeamById', async (data, { rejectWithValue }) => {
  try {
    const response = await ResourceService.getResourceTeamById(data);
    const { data: resourceTeamData } = response;
    const { resources } = resourceTeamData;

    const filteredResources = resources.reduce((acc, curr) => {
      if (curr.designation === DESIGNATION_TYPES.RESOURCE_MANAGER.key) {
        return { ...acc, resourceManagers: [...acc.resourceManagers, curr] };
      }

      if (curr.designation === DESIGNATION_TYPES.TEAM_LEAD.key) {
        return { ...acc, teamLeads: [...acc.teamLeads, curr] };
      }

      return { ...acc, otherResources: [...acc.otherResources, curr] };
    }, {
      resourceManagers: [],
      teamLeads: [],
      otherResources: []
    });

    return { resourceTeamData: { ...resourceTeamData, ...filteredResources } };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const removeResource = createAsyncThunk('resourceService/removeResource', async ({ teamId, resourceId }, { rejectWithValue }) => {
  try {
    return await ResourceService.removeResource(teamId, resourceId);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const addResourceInTeam = createAsyncThunk('resourceService/addResourceInTeam', async ({ data, teamId }, { rejectWithValue }) => {
  try {
    return await ResourceService.addResourceInTeam(data, teamId);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const updateResourceInTeam = createAsyncThunk('resourceService/updateResourceInTeam', async ({ data, teamId }, { rejectWithValue }) => {
  try {
    return await ResourceService.updateResourceInTeam(data, teamId);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const addTeam = createAsyncThunk('resourceService/addTeam', async (data, { rejectWithValue }) => {
  try {
    return await ResourceService.addResourceTeam(data);
  } catch (error) {
    let { message } = error;
    const splittedMessage = message?.split(':');
    if (splittedMessage?.length > 1) message = splittedMessage[1]?.trim();

    return rejectWithValue(message || 'Something went wrong');
  }
});

export const editTeam = createAsyncThunk('userService/editTeam', async (data, { rejectWithValue }) => {
  try {
    return await ResourceService.editResourceTeam(data);
  } catch (error) {
    let { message } = error;
    const splittedMessage = message?.split(':');
    if (splittedMessage?.length > 1) message = splittedMessage[1]?.trim();

    return rejectWithValue(message || 'Something went wrong');
  }
});

export const filters = createAsyncThunk('resourceService/filters', async (data, { rejectWithValue }) => {
  const {
    pageNumber, pageSize
  } = data;
  try {
    const response = await ResourceService.getResourceTeamList(pageNumber - 1, pageSize);
    const { data: resourceTeamData } = response;
    return {
      resourceTeamData, pageNumber, pageSize
    };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getUsersList = createAsyncThunk('resourceService/getUsersList', async (_, { rejectWithValue }) => {
  try {
    const response = await ResourceService.getAvailableResources();
    const { data: list } = response;
    return list;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const resourceTeamSlice = createSlice({
  name: 'resourceTeam',
  initialState,
  reducers: {
    resetPagination: (state) => ({
      ...state,
      filter: {
        pageNumber: defaultPagination.page,
        pageSize: defaultPagination.pageSize
      }
    }),
    hideMessage: (state) => ({
      ...state, loading: false, message: '', showMessage: false
    }),
    resetResourceDataFetched: (state) => ({
      ...state, isResourceDataFetched: false, usersList: [], filter: { pageNumber: 1, pageSize: 10 }
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(RESET_SLICE, () => (initialState)) // call on logout
      .addCase(getResourceTeamList.pending, (state) => ({ ...state, loading: true }))
      .addCase(getResourceTeamList.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        data: action.payload,
        filter: { pageNumber: action.payload.page, pageSize: action.payload.size }
      }))
      .addCase(getResourceTeamList.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, loading: false, status: ERROR
      }))
      .addCase(getResourceTeamById.pending, (state) => ({ ...state, loading: true }))
      .addCase(getResourceTeamById.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        data: action.payload
      }))
      .addCase(addResourceInTeam.pending, (state) => ({ ...state, loading: true }))
      .addCase(addResourceInTeam.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.resource.team.successMessage.resourceAdded'),
        status: SUCCESS
      }))
      .addCase(addResourceInTeam.rejected, (state, action) => ({
        ...state, showMessage: true, loading: false, message: action.payload, status: ERROR
      }))
      .addCase(updateResourceInTeam.pending, (state) => ({ ...state, loading: true }))
      .addCase(updateResourceInTeam.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.resource.team.successMessage.resourceUpdated'),
        status: SUCCESS
      }))
      .addCase(updateResourceInTeam.rejected, (state, action) => ({
        ...state, showMessage: true, loading: false, message: action.payload, status: ERROR
      }))
      .addCase(removeResource.pending, (state) => ({ ...state, loading: true }))
      .addCase(removeResource.rejected, (state, action) => ({
        ...state, showMessage: true, loading: false, message: action.payload, status: ERROR
      }))
      .addCase(removeResource.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.resource.team.successMessage.resourceRemoved'),
        status: SUCCESS
      }))
      .addCase(getResourceTeamById.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, loading: false, status: ERROR
      }))
      .addCase(getUsersList.pending, (state) => ({ ...state, fromLoading: true }))
      .addCase(getUsersList.fulfilled, (state, action) => ({
        ...state,
        fromLoading: false,
        usersList: action.payload,
        isResourceDataFetched: true
      }))
      .addCase(getUsersList.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, fromLoading: false, status: ERROR
      }))
      .addCase(addTeam.pending, (state) => ({ ...state, loading: true }))
      .addCase(addTeam.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.resource.team.successMessage.teamAdded'),
        status: SUCCESS
      }))
      .addCase(addTeam.rejected, (state, action) => ({
        ...state, showMessage: true, loading: false, message: action.payload, status: ERROR
      }))
      .addCase(editTeam.pending, (state) => ({ ...state, fromLoading: true, loading: true }))
      .addCase(editTeam.fulfilled, (state) => ({
        ...state,
        fromLoading: false,
        loading: false,
        showMessage: true,
        message: t('component.resource.team.successMessage.teamUpdated'),
        status: SUCCESS
      }))
      .addCase(editTeam.rejected, (state, action) => ({
        ...state,
        message: action.payload,
        loading: false,
        fromLoading: false,
        showMessage: true,
        status: ERROR
      }))
      .addCase(filters.pending, (state) => ({
        ...state, loading: true
      }))
      .addCase(filters.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        data: action.payload,
        filter: {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize
        }
      }))
      .addCase(filters.rejected, (state, action) => ({
        ...state,
        loading: false,
        message: action.payload,
        showMessage: true,
        status: ERROR
      }))
      .addCase(getResourceTeamNames.pending, (state) => ({ ...state, loading: true }))
      .addCase(getResourceTeamNames.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        resourceTeamNames: action.payload
      }))
      .addCase(getResourceTeamNames.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, loading: false, status: ERROR
      }));
  }
});

export const {
  hideMessage,
  resetResourceDataFetched,
  resetPagination
} = resourceTeamSlice.actions;

export default resourceTeamSlice.reducer;
