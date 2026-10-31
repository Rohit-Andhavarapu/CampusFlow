import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isDatabaseConnected, isAuthLoading } = useApp();
  const location = useLocation();

  // If in pure offline demo mode without Supabase, allow access
  if (!isDatabaseConnected) {
    return <Outlet />;
  }

  // Prevent redirect race while inspecting active Supabase session
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
