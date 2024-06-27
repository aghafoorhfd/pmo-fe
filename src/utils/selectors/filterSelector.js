import { createSelector } from '@reduxjs/toolkit';

const filters = (state) => state.filters;

export const filterSelector = createSelector(
  [filters, (_, filterName) => filterName],
  (_filters, filterName) => _filters[filterName] || {}
);
