import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isLoggedIn, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="spinner-wrap" style={{ height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
