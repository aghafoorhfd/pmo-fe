import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { STATUS } from 'constants/StatusConstant';
import SubscriptionService from 'services/SubscriptionService';

const { SUCCESS, ERROR } = STATUS;

export const initialState = {
  loading: false,
  status: SUCCESS,
  message: '',
  showMessage: false,
  activeSubscription: {},
  subscriptionsBillingList: [],
  enterpriseUpgradeProcessing: false
};

export const getActiveSubscription = createAsyncThunk('subscription/getActiveSubscription', async (_, { rejectWithValue }) => {
  try {
    const response = await SubscriptionService.getActiveSubscription();
    const { data } = response;
    return data;
  } catch (err) {
    return rejectWithValue(err?.message || 'Error');
  }
});

export const getSubscriptionsBilling = createAsyncThunk('subscription/getSubscriptionsBilling', async (_, { rejectWithValue }) => {
  try {
    const response = await SubscriptionService.getSubscriptionsBilling();
    const { data } = response;
    return data;
  } catch (err) {
    return rejectWithValue(err?.message || 'Error');
  }
});

export const upgradeEnterprisePlan = createAsyncThunk('subscription/upgradeEnterprisePlan', async (data, { rejectWithValue }) => {
  try {
    return await SubscriptionService.upgradeEnterprisePlan(data);
  } catch (err) {
    return rejectWithValue(err?.message || 'Error');
  }
});

export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    hideMessage: (state) => ({
      ...state, message: '', showMessage: false, status: SUCCESS
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActiveSubscription.pending, (state) => ({ ...state, loading: true }))
      .addCase(getActiveSubscription.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        activeSubscription: action.payload
      }))
      .addCase(getActiveSubscription.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, loading: false, status: ERROR
      }))

      .addCase(getSubscriptionsBilling.pending, (state) => ({ ...state, loading: true }))
      .addCase(getSubscriptionsBilling.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        subscriptionsBillingList: action.payload
      }))
      .addCase(getSubscriptionsBilling.rejected, (state, action) => ({
        ...state, message: action.payload, showMessage: true, loading: false, status: ERROR
      }))

      .addCase(upgradeEnterprisePlan.pending, (state) => ({
        ...state,
        enterpriseUpgradeProcessing: true
      }))
      .addCase(upgradeEnterprisePlan.fulfilled, (state) => ({
        ...state,
        enterpriseUpgradeProcessing: false
      }))
      .addCase(upgradeEnterprisePlan.rejected, (state, action) => ({
        ...state,
        message: action.payload,
        showMessage: true,
        enterpriseUpgradeProcessing: false,
        status: ERROR
      }));
  }
});

export const { hideMessage } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
