import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from 'constants/StatusConstant';
import i18n from 'i18next';
import { RESET_SLICE } from 'store/actions/resetSlice';
import { initialPaginationConfiguration as defaultPagination, MY_CONFLICT_STATUS } from 'constants/MiscConstant';
import ProjectService from 'services/ProjectService';
import UserService from '../../services/UserService';

const { SUCCESS, ERROR } = STATUS;
const { PINNED, UNPINNED } = MY_CONFLICT_STATUS;
const { t } = i18n;

export const initialState = {
  loading: false,
  optionsLoading: false,
  message: '',
  showMessage: false,
  conflictsList: {},
  projectOptions: [],
  impactedTeamsOptions: [],
  impactedMembersOptions: [],
  impactedOtherProjectOptions: [],
  projectHistory: {},
  conflictsDetails: {},
  monitoredConflicts: {
    pinnedConflictLoading: false,
    pinnedConflictShowMessage: false,
    pinnedConflictMessage: '',
    allConflicts: [],
    allConflictsLoading: false,
    loading: false,
    data: [],
    filter: {
      pageNumber: defaultPagination.page,
      pageSize: defaultPagination.pageSize
    },
    monitoredStats: [],
    monitoredStatsLoading: false
  },
  taggedConflicts: {
    loading: false,
    data: [],
    filter: {
      pageNumber: defaultPagination.page,
      pageSize: defaultPagination.pageSize
    },
    taggedStats: [],
    taggedStatsLoading: false
  },
  filter: {
    pageNumber: defaultPagination.page,
    pageSize: defaultPagination.pageSize
  },
  status: SUCCESS
};

export const getRiskList = createAsyncThunk('userService/getRiskList', async (values, { rejectWithValue }) => {
  const { riskStatus, pageNumber, pageSize } = values;

  try {
    const response = await ProjectService.getRisks(riskStatus, pageNumber - 1, pageSize);
    const { data } = response;
    return { data };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getAllRisks = createAsyncThunk('userService/getAllRisks', async (values, { rejectWithValue }) => {
  const {
    selectedTab, pageNumber, pageSize, searchTerm
  } = values;

  try {
    const { data } = await
    ProjectService.getAllRisks(selectedTab, pageNumber - 1, pageSize, searchTerm);
    return { data };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getTaggedRiskList = createAsyncThunk('userService/getTaggedRiskList', async (values, { rejectWithValue }) => {
  const {
    pageNumber, pageSize, selectedTab, filterOr
  } = values;

  try {
    const { data } = await ProjectService.getMyRisks(
      pageNumber - 1,
      pageSize,
      selectedTab,
      filterOr
    );
    return { data, pageNumber, pageSize };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getTaggedStats = createAsyncThunk('userService/getTaggedStats', async (values, { rejectWithValue }) => {
  const { conflictStatus } = values;

  try {
    const { data } = await ProjectService.getGraphStats(conflictStatus);
    return data;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getMonitoredRiskList = createAsyncThunk('userService/getMonitoredRiskList', async (values, { rejectWithValue }) => {
  const {
    pageNumber, pageSize, selectedTab, filterOr
  } = values;

  try {
    const { data } = await ProjectService.getMyRisks(
      pageNumber - 1,
      pageSize,
      selectedTab,
      filterOr
    );
    return { data, pageNumber, pageSize };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getMonitoredStats = createAsyncThunk('userService/getMonitoredStats', async (values, { rejectWithValue }) => {
  const { conflictStatus, allConflicts } = values;
  try {
    const { data } = await ProjectService.getGraphStats(conflictStatus, allConflicts);
    return data;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const pinnedAndUnpinnedRisk = createAsyncThunk('userService/pinnedAndUnpinnedRisk', async (values, { rejectWithValue }) => {
  const { payload, actionKey } = values;
  try {
    await ProjectService.updateRiskDetails(payload);

    const successMessage = {
      [PINNED]: t('component.general.user.success.message.conflictpinned'),
      [UNPINNED]: t('component.general.user.success.message.conflictUnpinned')
    };

    return successMessage[actionKey];
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getRiskDetails = createAsyncThunk('userService/getRiskDetails', async (values, { rejectWithValue }) => {
  try {
    const response = await ProjectService.getRiskDetails(values);
    return response;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getRiskHistoryDetails = createAsyncThunk('userService/getRiskHistoryDetails', async (values, { rejectWithValue }) => {
  try {
    const response = await ProjectService.getRiskHistoryDetails(values);
    return response;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getProjectHistoryDetail = createAsyncThunk('userService/getProjectHistoryDetail', async (values, { rejectWithValue }) => {
  try {
    const { data } = await ProjectService.getProjectHistoryDetail(values);
    return data;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const addNewRisk = createAsyncThunk('userService/addNewRisk', async (values, { rejectWithValue }) => {
  try {
    return await ProjectService.addNewRisk(values);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const updateRiskDetails = createAsyncThunk('userService/updateRiskDetails', async (values, { rejectWithValue }) => {
  const messageAsPerAction = () => {
    const messages = {
      OPENED: t('component.conflict.manager.message.success.riskUpdated'),
      RESOLVED: t('component.conflict.manager.message.success.riskIsResolved', { conflictName: values.conflictName }),
      CANCELLED: t('component.conflict.manager.message.success.riskIsCanceled', { conflictName: values.conflictName })
    };
    return messages[values?.conflictStatus];
  };
  try {
    await ProjectService.updateRiskDetails(values);
    return messageAsPerAction();
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getProjectNamesList = createAsyncThunk('userService/getProjectNamesList', async (_, { rejectWithValue }) => {
  try {
    const response = await ProjectService.getProjectNames();
    const { data } = response;
    return { data };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getTeamNamesList = createAsyncThunk('userService/getTeamNamesList', async (_, { rejectWithValue }) => {
  try {
    const response = await UserService.getTeamNames();
    const { data } = response;
    return { data };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getUsersList = createAsyncThunk('userService/getUsersList', async (_, { rejectWithValue }) => {
  try {
    const response = await UserService.getUsersList();
    const { data } = response;
    return { data };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getImpactedOtherProjects = createAsyncThunk('userService/getImpactedOtherProjects', async (_, { rejectWithValue }) => {
  try {
    const response = await ProjectService.getOtherImpactedProjects();
    const { data } = response;
    return { data };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const filters = createAsyncThunk('userService/filters', async (values, { rejectWithValue }) => {
  const {
    conflictStatus, pageNumber, pageSize
  } = values;

  try {
    const response = await ProjectService.getRisks(conflictStatus, pageNumber - 1, pageSize);
    const { data } = response;
    return { data, pageNumber, pageSize };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const riskManagementSlice = createSlice({
  name: 'riskManagement',
  initialState,
  reducers: {
    hideMessage: (state) => ({
      ...state, loading: false, message: '', showMessage: false, status: '', monitoredConflicts: { ...state.monitoredConflicts, pinnedConflictShowMessage: false }
    }),
    resetConflictStore: () => ({
      ...initialState
    }),
    resetPagination: (state) => ({
      ...state,
      filter: {
        pageNumber: defaultPagination.page,
        pageSize: defaultPagination.pageSize
      },
      taggedConflicts: {
        ...state.taggedConflicts,
        filter: {
          pageNumber: defaultPagination.page,
          pageSize: defaultPagination.pageSize
        }
      },
      monitoredConflicts: {
        ...state.monitoredConflicts,
        filter: {
          pageNumber: defaultPagination.page,
          pageSize: defaultPagination.pageSize
        }
      }
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(RESET_SLICE, () => (initialState)) // call on logout
      .addCase(getRiskList.pending, (state) => ({ ...state, loading: true }))
      .addCase(getRiskList.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        conflictsList: { ...action.payload }
      }))
      .addCase(getRiskList.rejected, (state) => ({
        ...state, loading: false
      }))
      .addCase(getAllRisks.pending, (state) => ({
        ...state,
        monitoredConflicts: {
          ...state.monitoredConflicts,
          allConflictsLoading: true
        }
      }))
      .addCase(getAllRisks.fulfilled, (state, action) => ({
        ...state,
        monitoredConflicts: {
          ...state.monitoredConflicts,
          allConflictsLoading: false,
          allConflicts: action.payload
        }
      }))
      .addCase(getAllRisks.rejected, (state) => ({
        ...state,
        monitoredConflicts: {
          ...state.monitoredConflicts,
          allConflictsLoading: false
        }
      }))
      .addCase(getTaggedRiskList.pending, (state) => ({
        ...state,
        taggedConflicts: {
          ...state.taggedConflicts,
          loading: true
        }
      }))
      .addCase(getTaggedRiskList.fulfilled, (state, action) => {
        const {
          data,
          pageNumber,
          pageSize
        } = action.payload;
        return {
          ...state,
          taggedConflicts: {
            ...state.taggedConflicts,
            loading: false,
            data,
            filter: { pageNumber, pageSize }
          }
        };
      })
      .addCase(getTaggedRiskList.rejected, (state) => ({
        ...state,
        taggedConflicts: {
          ...state.taggedConflicts,
          loading: false
        }
      }))
      .addCase(getMonitoredRiskList.pending, (state) => ({
        ...state,
        monitoredConflicts: {
          ...state.monitoredConflicts,
          loading: true
        }
      }))
      .addCase(getMonitoredRiskList.fulfilled, (state, action) => {
        const {
          data,
          pageNumber,
          pageSize
        } = action.payload;
        return {
          ...state,
          monitoredConflicts: {
            ...state.monitoredConflicts,
            loading: false,
            data,
            filter: { pageNumber, pageSize }
          }
        };
      })
      .addCase(getMonitoredRiskList.rejected, (state) => ({
        ...state,
        monitoredConflicts: {
          ...state.monitoredConflicts,
          loading: false
        }
      }))
      .addCase(getTaggedStats.pending, (state) => ({
        ...state,
        taggedConflicts: {
          ...state.taggedConflicts,
          taggedStatsLoading: true
        }
      }))
      .addCase(getTaggedStats.fulfilled, (state, action) => ({
        ...state,
        taggedConflicts: {
          ...state.taggedConflicts,
          taggedStats: action.payload,
          taggedStatsLoading: false
        }
      }))
      .addCase(getTaggedStats.rejected, (state) => ({
        ...state,
        taggedConflicts: {
          ...state.taggedConflicts,
          taggedStatsLoading: false
        }
      }))
      .addCase(getMonitoredStats.pending, (state) => ({
        ...state,
        monitoredConflicts: {
          ...state.monitoredConflicts,
          monitoredStatsLoading: true
        }
      }))
      .addCase(getMonitoredStats.fulfilled, (state, action) => ({
        ...state,
        monitoredConflicts: {
          ...state.monitoredConflicts,
          monitoredStats: action.payload,
          monitoredStatsLoading: false
        }
      }))
      .addCase(getMonitoredStats.rejected, (state) => ({
        ...state,
        monitoredConflicts: {
          ...state.monitoredConflicts,
          monitoredStatsLoading: false
        }
      }))
      .addCase(pinnedAndUnpinnedRisk.pending, (state) => ({
        ...state,
        monitoredConflicts: {
          ...state.monitoredConflicts,
          pinnedConflictLoading: true
        }
      }))
      .addCase(pinnedAndUnpinnedRisk.fulfilled, (state, action) => ({
        ...state,
        status: SUCCESS,
        monitoredConflicts: {
          ...state.monitoredConflicts,
          pinnedConflictLoading: false,
          pinnedConflictMessage: action.payload,
          pinnedConflictShowMessage: true
        }
      }))
      .addCase(pinnedAndUnpinnedRisk.rejected, (state, action) => ({
        ...state,
        status: ERROR,
        monitoredConflicts: {
          ...state.monitoredConflicts,
          pinnedConflictLoading: false,
          pinnedConflictMessage: action.payload,
          pinnedConflictShowMessage: true
        }
      }))
      .addCase(getRiskDetails.pending, (state) => ({
        ...state,
        loading: true,
        optionsLoading: true
      }))
      .addCase(getRiskDetails.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        optionsLoading: false,
        conflictsDetails: action.payload
      }))
      .addCase(getRiskDetails.rejected, (state, action) => ({
        ...state,
        loading: false,
        message: action.payload,
        showMessage: true,
        status: ERROR,
        optionsLoading: false
      }))
      .addCase(getRiskHistoryDetails.pending, (state) => ({
        ...state,
        loading: true,
        optionsLoading: true
      }))
      .addCase(getRiskHistoryDetails.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        optionsLoading: false,
        conflictsHistory: action.payload
      }))
      .addCase(getRiskHistoryDetails.rejected, (state, action) => ({
        ...state,
        loading: false,
        message: action.payload,
        showMessage: true,
        status: ERROR,
        optionsLoading: false
      }))
      .addCase(getProjectHistoryDetail.pending, (state) => ({
        ...state,
        loading: true
      }))
      .addCase(getProjectHistoryDetail.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        projectHistory: action.payload
      }))
      .addCase(getProjectHistoryDetail.rejected, (state, action) => ({
        ...state,
        loading: false,
        message: action.payload,
        showMessage: true,
        status: ERROR
      }))
      .addCase(addNewRisk.pending, (state) => ({ ...state, loading: true }))
      .addCase(addNewRisk.fulfilled, (state) => ({
        ...state,
        loading: false,
        message: t('component.conflict.manager.message.success.newRiskCreated'),
        showMessage: true,
        status: SUCCESS
      }))
      .addCase(addNewRisk.rejected, (state, action) => ({
        ...state, loading: false, message: action.payload, showMessage: true, status: ERROR
      }))
      .addCase(updateRiskDetails.pending, (state) => ({ ...state, loading: true }))
      .addCase(updateRiskDetails.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        message: action.payload,
        showMessage: true,
        status: SUCCESS
      }))
      .addCase(updateRiskDetails.rejected, (state, action) => ({
        ...state, loading: false, message: action.payload, showMessage: true, status: ERROR
      }))
      .addCase(getProjectNamesList.pending, (state) => ({ ...state, optionsLoading: true }))
      .addCase(getProjectNamesList.fulfilled, (state, action) => ({
        ...state,
        optionsLoading: false,
        projectOptions: action.payload
      }))
      .addCase(getProjectNamesList.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, optionsLoading: false, status: ERROR
      }))
      .addCase(getTeamNamesList.pending, (state) => ({ ...state, optionsLoading: true }))
      .addCase(getTeamNamesList.fulfilled, (state, action) => ({
        ...state,
        optionsLoading: false,
        impactedTeamsOptions: action.payload
      }))
      .addCase(getTeamNamesList.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, optionsLoading: false, status: ERROR
      }))
      .addCase(getUsersList.pending, (state) => ({ ...state, optionsLoading: true }))
      .addCase(getUsersList.fulfilled, (state, action) => ({
        ...state,
        optionsLoading: false,
        impactedMembersOptions: action.payload
      }))
      .addCase(getUsersList.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, optionsLoading: false, status: ERROR
      }))
      .addCase(getImpactedOtherProjects.pending, (state) => ({ ...state, optionsLoading: true }))
      .addCase(getImpactedOtherProjects.fulfilled, (state, action) => ({
        ...state,
        optionsLoading: false,
        impactedOtherProjectOptions: action.payload
      }))
      .addCase(getImpactedOtherProjects.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, optionsLoading: false, status: ERROR
      }))
      .addCase(filters.pending, (state) => ({
        ...state, loading: true
      }))
      .addCase(filters.fulfilled, (state, action) => {
        const { pageNumber, pageSize } = action.payload;
        return {
          ...state,
          loading: false,
          conflictsList: action.payload,
          filter: { pageNumber, pageSize }
        };
      })
      .addCase(filters.rejected, (state, action) => ({
        ...state,
        loading: false,
        message: action.payload,
        showMessage: true,
        status: ERROR
      }));
  }
});

export const {
  hideMessage,
  resetConflictStore,
  resetPagination
} = riskManagementSlice.actions;

export default riskManagementSlice.reducer;
