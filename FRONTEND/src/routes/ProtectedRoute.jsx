import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — HOC that guards routes requiring authentication.
 *
 * If user is NOT logged in → redirect to /login
 * If user IS logged in     → render the child component
 *
 * Also stores the attempted URL so we can redirect back after login.
 *
 * Usage in App.js:
 *   <Route path="/my-bookings" element={
 *     <ProtectedRoute><BookingsPage /></ProtectedRoute>
 *   } />
 */
function ProtectedRoute({ children }) {
  const { isLoggedIn, authLoading } = useAuth();
  const location = useLocation();

  // Wait for localStorage check before deciding
  if (authLoading) {
    return (
      <div className="spinner-wrap" style={{ height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  // Not logged in — redirect to login, remember where they came from
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in — render the protected page
  return children;
}

export default ProtectedRoute;
