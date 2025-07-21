// @ts-nocheck
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * PrivateRoute component for protecting routes that require authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 * @returns {React.ReactNode} - Protected route component
 */
function PrivateRoute({ children, allowedRoles = [] }) {
  // Check if user is authenticated
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If specific roles are required, check user role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User doesn't have required role, redirect to login or unauthorized page
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role, render children
  return children;
}

export default PrivateRoute;
