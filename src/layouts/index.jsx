import React, { lazy, Suspense, memo } from 'react';
import { useSelector } from 'react-redux';
import Loading from 'components/shared-components/Loading';
import Views from 'views';

const AppLayout = lazy(() => import('./AppLayout'));
const AuthLayout = lazy(() => import('./AuthLayout'));

function Layouts() {
  const token = useSelector((state) => state.auth.token);
  const blankLayout = useSelector((state) => state.theme.blankLayout);

  const Layout = token && !blankLayout ? AppLayout : AuthLayout;

  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Layout>
        <Views />
      </Layout>
    </Suspense>
  );
}

export default memo(Layouts);
