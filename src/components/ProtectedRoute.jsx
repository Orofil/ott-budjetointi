import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Tuo UserContext

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext); // Käytetään contextista käyttäjätietoja

  if (!user) {
    return <Navigate to="/login" />; // Jos ei ole kirjautunut, ohjataan kirjautumissivulle
  }

  return children; // Jos on kirjautunut, näytetään komponentti
};

export default ProtectedRoute;