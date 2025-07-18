import React from "react";
import { Navigate } from "react-router-dom";
import { clientAuthApi } from "../services/clientAuthApi";

/**
 * ClientPrivateRoute component for protecting client routes that require authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} - Protected route component
 */
function ClientPrivateRoute({ children }) {
  // Check if client is authenticated
  const isAuthenticated = clientAuthApi.isAuthenticated();
  const clientInfo = clientAuthApi.getClientInfo();

  // If no token, redirect to client login
  if (!isAuthenticated) {
    return <Navigate to="/client/login" replace />;
  }

  // Check if user has member role (clients use member role)
  if (clientInfo.role && clientInfo.role !== "member") {
    // User doesn't have required role, redirect to client login
    return <Navigate to="/client/login" replace />;
  }

  // Client is authenticated and has required role, render children
  return children;
}

export default ClientPrivateRoute;
