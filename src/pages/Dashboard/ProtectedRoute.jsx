import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/blogStore";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/dashboard/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
