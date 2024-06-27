import { configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import rootReducer from './rootReducer';

const middlewares = [];

const store = configureStore({
  reducer: rootReducer(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false
  }).concat(middlewares),
  devTools: process.env.REACT_APP_NODE_ENV === 'development'
});

store.asyncReducers = {};

export const injectReducer = (key, reducer) => {
  if (store.asyncReducers[key]) {
    return false;
  }
  store.asyncReducers[key] = reducer;
  store.replaceReducer(rootReducer(store.asyncReducers));
  return store;
};

export default store;
