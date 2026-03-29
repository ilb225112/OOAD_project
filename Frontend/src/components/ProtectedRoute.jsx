import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Protected Route Component
 * Implements authentication guard pattern
 * Redirects unauthenticated users to login page
 */
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
