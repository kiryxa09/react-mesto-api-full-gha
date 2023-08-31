import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRouteElement = ({ element: Component, ...props }) => {
  const appContext = useContext(AppContext);
  return appContext.loggedIn ? (
    <Component {...props} />
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default ProtectedRouteElement;
