import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isDatabaseConnected } = useApp();
  const location = useLocation();

  // If in pure offline demo mode without Supabase, allow access
  if (!isDatabaseConnected) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
