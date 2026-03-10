import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}