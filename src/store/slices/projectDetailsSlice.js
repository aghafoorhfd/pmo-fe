import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ProjectService from 'services/ProjectService';
import { STATUS } from 'constants/StatusConstant';
import i18n from 'i18next';
import { ACCESS_TYPES } from 'constants/AccessTypes';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import { startCase, union } from 'lodash';
import {
  preProcessingQuartersData,
  preProcessingSprintsData
} from 'utils/cadenceUtils';
import { RESET_SLICE } from 'store/actions/resetSlice';
import moment from 'moment';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';
import UserService from '../../services/UserService';

const { SUCCESS, ERROR } = STATUS;
const { t } = i18n;
const { AGILE_CAPS } = methodologyType;

export const initialState = {
  loading: false,
  inviteLoading: false,
  message: '',
  showMessage: false,
  configurationMetrics: {},
  generalUsers: [],
  status: '',
  projectList: [],
  selectedProjectDetails: '',
  sdlcLoading: false,
  agileLoading: false,
  projectCadence: {
    agile: null, sdlc: null
  },
  isInvitationModalVisible: false,
  isGeneralUsersLoaded: false,
  stageToEdit: {
    loading: false,
    stageDetails: {},
    subStages: []
  }
};

export const getConfigurationOptions = createAsyncThunk('projectService/getConfigurationOptions', async (data, { rejectWithValue }) => {
  const getProjectMetrics = (res) => {
    if (res.status === 'fulfilled') {
      const { value: { data: { metrics = {} } = {} } } = res;
      return metrics;
    }
    return {};
  };
  const combineMetrics = (global, project) => {
    const projectMetric = getProjectMetrics(project);
    const globalMetric = getProjectMetrics(global);
    const uniqueMetricKeys = union(Object.keys(projectMetric), Object.keys(globalMetric));
    const combinedMetric = {};
    if (uniqueMetricKeys?.length > 0) {
      uniqueMetricKeys.forEach((key) => {
        const projectMetricData = projectMetric[key]?.selected || [];
        const globalMetricData = globalMetric[key] || [];
        combinedMetric[key] = [...globalMetricData, ...projectMetricData];
      });
    }
    return combinedMetric;
  };
  try {
    const [globalConfiguration, projectConfiguration] = await Promise.allSettled(
      [UserService.getGlobalConfigurations(), ProjectService.getProjectConfigurations()]
    );
    // concat global and project objects and returned combined object
    return combineMetrics(globalConfiguration, projectConfiguration);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});
export const getGeneralUsers = createAsyncThunk('projectService/getGeneralUsers', async (data, { rejectWithValue }) => {
  try {
    const response = await UserService.getUsersByType(ACCESS_TYPES.GENERAL_USER);
    const { data: usersList } = response;
    return usersList;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});
export const addProject = createAsyncThunk('projectService/addProject', async (data, { rejectWithValue }) => {
  try {
    return await ProjectService.addProject(data);
  } catch (error) {
    return rejectWithValue(error || 'Something went wrong');
  }
});
export const updateProject = createAsyncThunk('projectService/updateProject', async (data, { rejectWithValue }) => {
  try {
    return await ProjectService.updateProject(data);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const inviteStakeHolders = createAsyncThunk('projectService/inviteStakeHolders', async (data, { rejectWithValue }) => {
  try {
    await ProjectService.inviteStakeHolders(data);
    return data.stakeHolders;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});
export const getProjectCadence = createAsyncThunk('projectService/getProjectCadence', async (data, { rejectWithValue }) => {
  try {
    const res = await ProjectService.getProjectAgileDetails();
    const {
      sprintDuration,
      sprintStartDate,
      sprintName,
      fiscalYearStartDate,
      currentHalfSprints,
      fiscalYearName,
      currentYearQuarters
    } = res?.data || {};
    const projectCadence = { agile: null, sdlc: null };
    if (sprintStartDate) {
      const sprints = preProcessingSprintsData(currentHalfSprints);
      projectCadence.agile = {
        sprintDuration,
        sprintStartDate,
        sprintName,
        currentHalfSprints,
        sprints
      };
    }
    if (fiscalYearStartDate) {
      const [quarters, quartersNames] = preProcessingQuartersData(currentYearQuarters);
      projectCadence.sdlc = {
        fiscalYearStartDate,
        fiscalYearName: startCase(fiscalYearName),
        currentYearQuarters: [quarters],
        quartersNames,
        quarters: currentYearQuarters
      };
    }
    return projectCadence;
  } catch ({ message }) {
    return rejectWithValue(message || 'Something went wrong');
  }
});
export const updateProjectCadence = createAsyncThunk('projectService/updateProjectCadence', async (data, { rejectWithValue }) => {
  try {
    const { data: message } = await ProjectService.updateProjectAgileDetails(data);
    return message || t('component.cadence.update.success');
  } catch ({ message }) {
    return rejectWithValue(message || 'Something went wrong');
  }
});
export const saveProjectCadence = createAsyncThunk('projectService/saveProjectCadence', async (data, { rejectWithValue }) => {
  try {
    return ProjectService.saveProjectAgileDetails(data);
  } catch ({ message }) {
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getStageDetails = createAsyncThunk('projectService/getStageDetails', async ({ projectId, selectedStageName }, { rejectWithValue }) => {
  try {
    const {
      data: {
        outlook, metricName, subStages: preDefinedSubStages = [], startDate,
        endDate, metricStatus, dependencies, metricType
      }
    } = await ProjectService.getStageDetails(
      projectId,
      selectedStageName
    );

    return ({
      stageDetails: {
        outlook,
        dependencies,
        metricStatus,
        metricType,
        stage: metricName,
        ...(!preDefinedSubStages.length ? {
          stageDateRange: [moment(startDate, DATE_FORMAT_DD_MM_YYYY),
            moment(endDate, DATE_FORMAT_DD_MM_YYYY)]
        } : {})
      },
      subStages: preDefinedSubStages.map((subStage) => ({
        ...subStage,
        startDate: moment(subStage.startDate, DATE_FORMAT_DD_MM_YYYY),
        endDate: moment(subStage.endDate, DATE_FORMAT_DD_MM_YYYY)
      }))
    });
  } catch ({ message }) {
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const projectDetailsSlice = createSlice({
  name: 'projectDetails',
  initialState,
  reducers: {
    setInitialData: (state, action) => ({ ...state, loading: false, ...action.payload }),
    setSelectedProjectDetails: (state, action) => (
      { ...state, selectedProjectDetails: action.payload }),
    setProjectList: (state, action) => ({ ...state, projectList: action.payload }),
    hideMessage: (state) => ({
      ...state, message: '', showMessage: false, status: ''
    }),
    invitationModalToggler: (state) => (
      {
        ...state,
        isInvitationModalVisible: !state.isInvitationModalVisible
      }),
    setSubStages: (state, action) => (
      {
        ...state,
        stageToEdit: {
          ...state.stageToEdit,
          ...action.payload
        }
      }),
    resetStageToEdit: (state) => (
      {
        ...state,
        stageToEdit: {
          loading: false,
          stageDetails: {},
          subStages: []
        }
      })
  },
  extraReducers: (builder) => {
    builder
      .addCase(RESET_SLICE, () => (initialState)) // call on logout
      .addCase(getConfigurationOptions.pending, (state) => ({ ...state, loading: true }))
      .addCase(getConfigurationOptions.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        configurationMetrics: action.payload
      }))
      .addCase(getConfigurationOptions.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, loading: false
      }))
      .addCase(addProject.pending, (state) => ({ ...state, loading: true }))
      .addCase(addProject.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.project.manager.project.details.userAdded.success.message'),
        status: SUCCESS
      }))
      .addCase(addProject.rejected, (state, action) => {
        const { code, message } = action.payload;
        let messageToShow = message;
        if (code === '1028') {
          if (message.includes('Project Number')) {
            messageToShow = t('component.project.manager.project.details.error.project.number.exist');
          } else if (message.includes('Project already exists')) {
            messageToShow = t('component.project.manager.project.details.error.project.name.exist');
          }
        }
        return {
          ...state,
          showMessage: true,
          message: messageToShow,
          loading: false,
          status: ERROR
        };
      })
      .addCase(updateProject.pending, (state) => ({ ...state, loading: true }))
      .addCase(updateProject.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.project.manager.project.details.userUpdated.success.message'),
        status: SUCCESS
      }))
      .addCase(updateProject.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR
      }))
      .addCase(getGeneralUsers.pending, (state) => ({ ...state, isGeneralUsersLoaded: false }))
      .addCase(getGeneralUsers.fulfilled, (state, action) => ({
        ...state,
        generalUsers: action.payload,
        isGeneralUsersLoaded: true
      }))
      .addCase(getGeneralUsers.rejected, (state, action) => ({
        ...state,
        message: action.payload,
        showMessage: true,
        isGeneralUsersLoaded: true
      }))
      .addCase(updateProjectCadence.pending, (state, action) => {
        const { methodologyType: type } = action.meta.arg;
        return {
          ...state,
          ...(type === AGILE_CAPS ? { agileLoading: true } : { sdlcLoading: true })
        };
      })
      .addCase(updateProjectCadence.fulfilled, (state, action) => {
        const { methodologyType: cadenceType } = action.meta.arg;
        return {
          ...state,
          message: action.payload,
          showMessage: true,
          status: SUCCESS,
          methodologyType: cadenceType
        };
      })
      .addCase(updateProjectCadence.rejected, (state, action) => {
        const { methodologyType: cadenceType } = action.meta.arg;
        return {
          ...state,
          message: action.payload,
          showMessage: true,
          status: ERROR,
          ...(cadenceType === AGILE_CAPS ? { agileLoading: false }
            : { sdlcLoading: false })
        };
      })
      .addCase(saveProjectCadence.pending, (state, action) => {
        const { methodologyType: cadenceType } = action.meta.arg;
        return {
          ...state,
          ...(cadenceType === AGILE_CAPS ? { agileLoading: true }
            : { sdlcLoading: true })
        };
      })
      .addCase(saveProjectCadence.fulfilled, (state, action) => {
        const { methodologyType: cadenceType } = action.meta.arg;
        return {
          ...state,
          methodologyType: cadenceType,
          showMessage: true,
          status: SUCCESS,
          message: cadenceType === AGILE_CAPS ? t('component.cadence.agile.save.success')
            : t('component.cadence.sdlc.save.success')
        };
      })
      .addCase(saveProjectCadence.rejected, (state, action) => {
        const { methodologyType: type } = action.meta.arg;
        return {
          ...state,
          message: action.payload,
          showMessage: true,
          status: ERROR,
          ...(type === AGILE_CAPS ? { agileLoading: false }
            : { sdlcLoading: false })
        };
      })
      .addCase(getProjectCadence.pending, (state, action) => {
        const { arg } = action.meta;
        if (!arg) {
          return { ...state, agileLoading: true, sdlcLoading: true };
        }
        return {
          ...state,
          ...(action?.meta?.arg === AGILE_CAPS ? { agileLoading: true }
            : { sdlcLoading: true })
        };
      })
      .addCase(getProjectCadence.fulfilled, (state, action) => {
        const { arg } = action.meta;
        if (!arg) {
          return {
            ...state,
            agileLoading: false,
            sdlcLoading: false,
            status: SUCCESS,
            showMessage: false,
            message: '',
            projectCadence: action.payload
          };
        }
        return {
          ...state,
          ...(arg === AGILE_CAPS ? { agileLoading: false }
            : { sdlcLoading: false }),
          status: SUCCESS,
          showMessage: false,
          message: '',
          projectCadence: action.payload
        };
      })
      .addCase(getProjectCadence.rejected, (state, action) => {
        const { arg } = action.meta;
        const res = {
          ...state,
          message: action.payload,
          showMessage: true,
          status: ERROR
        };
        if (!arg) {
          return {
            ...res,
            agileLoading: false,
            sdlcLoading: false
          };
        }
        return {
          ...res,
          ...(arg === AGILE_CAPS ? { agileLoading: false }
            : { sdlcLoading: false })
        };
      })

      .addCase(inviteStakeHolders.pending, (state) => ({ ...state, inviteLoading: true }))
      .addCase(inviteStakeHolders.fulfilled, (state, action) => ({
        ...state,
        inviteLoading: false,
        showMessage: true,
        message: t('component.project.manager.project.details.inviteStake.success.message'),
        status: SUCCESS,
        invitedStakeHolders: action.payload
      }))
      .addCase(inviteStakeHolders.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        inviteLoading: false,
        status: ERROR
      }))
      .addCase(getStageDetails.pending, (state) => ({
        ...state,
        stageToEdit:
          { ...state.stageToEdit, loading: true }
      }))
      .addCase(getStageDetails.fulfilled, (state, action) => ({
        ...state,
        stageToEdit: {
          ...action.payload,
          loading: false
        }
      }))
      .addCase(getStageDetails.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        stageToEdit: { ...state.stageToEdit, loading: false },
        status: ERROR
      }));
  }
});

export const {
  setInitialData,
  setSelectedProjectDetails,
  setProjectList,
  hideMessage,
  invitationModalToggler,
  setSubStages,
  resetStageToEdit
} = projectDetailsSlice.actions;

export default projectDetailsSlice.reducer;
