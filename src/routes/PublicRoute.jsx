import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PublicRoute() {
  const {
    token, redirect: redirectURL
  } = useSelector((state) => state.auth);
  return token ? <Navigate to={redirectURL || '/'} /> : <Outlet />;
}

export default PublicRoute;
