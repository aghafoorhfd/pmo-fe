import { combineReducers } from 'redux';
import theme from './slices/themeSlice';
import auth from './slices/authSlice';
import user from './slices/userSlice';
import resourceTeam from './slices/resourceTeamSlice';
import projectDetails from './slices/projectDetailsSlice';
import riskManagement from './slices/riskManagementSlice';
import analytics from './slices/analyticsSlice';
import customerActivation from './slices/customerActivationSlice';
import filters from './slices/filterSlice';
import jira from './slices/jiraSlice';
import subscription from './slices/subscriptionSlice';

const rootReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    auth,
    riskManagement,
    projectDetails,
    resourceTeam,
    theme,
    user,
    analytics,
    customerActivation,
    filters,
    jira,
    subscription,
    ...asyncReducers
  });
  return combinedReducer(state, action);
};

export default rootReducer;
