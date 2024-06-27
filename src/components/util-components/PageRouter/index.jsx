import React, { Suspense } from 'react';
import {
  Route, useRouteMatch, Switch, Redirect
} from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

function PageRouter({
  routes, from, to, align, cover
}) {
  const { url } = useRouteMatch();
  const loadingProps = { align, cover };
  return (
    <Suspense fallback={<Loading {...loadingProps} />}>
      <Switch>
        {routes.map((route) => (
          <Route key={route.path} component={route.component} path={`${url}/${route.path}`} />
        ))}
        <Redirect from={from} to={to} />
      </Switch>
    </Suspense>
  );
}

export default PageRouter;
