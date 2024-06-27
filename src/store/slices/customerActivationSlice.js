import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RESET_SLICE } from 'store/actions/resetSlice';
import { STATUS } from 'constants/StatusConstant';
import { initialPaginationConfiguration } from 'constants/MiscConstant';
import SubscriptionService from '../../services/SubscriptionService';

const { SUCCESS, ERROR } = STATUS;
export const initialState = {
  loading: false,
  message: '',
  showMessage: false,
  customersList: [],
  filter: {
    pageNumber: initialPaginationConfiguration.page,
    pageSize: initialPaginationConfiguration.pageSize
  },
  status: SUCCESS
};

export const getAllB2BCustomersPlansList = createAsyncThunk('userService/getAllB2BCustomersPlansList', async (_, { rejectWithValue }) => {
  const { pageNumber, pageSize } = initialState.filter;
  try {
    const response = await SubscriptionService.getAllB2BPlans(
      pageNumber - 1,
      pageSize
    );
    const { data } = response;
    return { data };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const filters = createAsyncThunk('userService/filters', async (filtersData, { rejectWithValue }) => {
  const {
    pageNumber, pageSize
  } = filtersData;

  try {
    const response = await SubscriptionService.getAllB2BPlans(
      pageNumber - 1,
      pageSize
    );
    const { data } = response;
    return {
      data, pageNumber, pageSize
    };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const customerActivationSlice = createSlice({
  name: 'customerActivation',
  initialState,
  reducers: {
    hideMessage: (state) => ({
      ...state, loading: false, message: '', showMessage: false
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(RESET_SLICE, () => (initialState)) // call on logout
      .addCase(getAllB2BCustomersPlansList.pending, (state) => ({ ...state, loading: true }))
      .addCase(getAllB2BCustomersPlansList.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        customersList: action.payload
      }))
      .addCase(getAllB2BCustomersPlansList.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, loading: false, status: ERROR
      }))
      .addCase(filters.pending, (state) => ({
        ...state, loading: true
      }))
      .addCase(filters.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        customersList: action.payload,
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
      }));
  }
});

export const { hideMessage } = customerActivationSlice.actions;

export default customerActivationSlice.reducer;
