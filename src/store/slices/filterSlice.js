import { createSlice } from '@reduxjs/toolkit';
import { getFilterURI } from 'utils/utils';

export const initialState = {};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const draft = state;
      const filterName = action.payload.name;
      if (!state[filterName]) {
        draft[filterName] = {};
      }
      // Filter Object
      draft[filterName].applied = action.payload.applied;
      // Formatted values
      draft[filterName].formatted = action.payload.formatted;
      // Filter URI, used to pass in api's
      draft[filterName].uri = getFilterURI(action.payload.applied, action.payload.formatted);
      // Flag use to check if filters has changed, and call parent callback
      draft[filterName].refresh = true;
    },
    resetFilters: (state, action) => {
      const draft = state;
      delete draft[action.payload.name];
    },
    resetRefreshFlag: (state, action) => {
      const draft = state;
      draft[action.payload.name].refresh = false;
    }
  }
});

export const {
  setFilters,
  resetFilters,
  resetRefreshFlag
} = filterSlice.actions;

export default filterSlice.reducer;
