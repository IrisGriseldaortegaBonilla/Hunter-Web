import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RutaProtegida = ({ children, permiso }) => {
  const { usuario, tienePermiso } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (permiso && !tienePermiso(permiso)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RutaProtegida;