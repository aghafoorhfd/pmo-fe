import React from 'react';
import { useSelector } from 'react-redux';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { routesParser } from 'utils/utils';

import {
  publicRoutes,
  webRoutes,
  privateRoutes
} from '../configs/RoutesConfig';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AppRoute from './AppRoute';

function Routes() {
  const role = useSelector((state) => state?.auth?.user);
  const { user: { privileges = [] } } = useSelector((state) => ({ user: state.user }));

  let result;
  if (privileges?.length > 0) {
    result = routesParser(privileges, privateRoutes, role);
  }

  const renderRoutes = () => (
    result?.map((route) => (
      <React.Fragment key={route.key}>
        <Route key={route.key} path="/" element={<Navigate to={route.path} />} />
        <Route
          path={route.path}
          element={(
            <AppRoute
              routeKey={route.key}
              component={route.component}
              blankLayout={route?.blankRoute}
              {...route.meta} />
          )} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </React.Fragment>
    ))
  );

  return (
    <RouterRoutes>
      <Route path="/" element={<ProtectedRoute />}>
        {renderRoutes()}
      </Route>
      <Route path="/" element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <React.Fragment key={route.path}>
            <Route
              path={route.path}
              element={
                <AppRoute routeKey={route.key} component={route.component} {...route.meta} />
              } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </React.Fragment>
        ))}
      </Route>
      <Route path="/" element={<PublicRoute />}>
        {webRoutes.map((route) => (
          <React.Fragment key={route.path}>
            <Route
              key={route.path}
              path={route.path}
              element={(
                <AppRoute
                  routeKey={route.key}
                  component={route.component}
                  {...route.meta} />
              )} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </React.Fragment>
        ))}
      </Route>
    </RouterRoutes>
  );
}

export default Routes;
