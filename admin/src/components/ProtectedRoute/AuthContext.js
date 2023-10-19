import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
     return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
     const [token, setToken] = useState(localStorage.getItem("token"));

     const login = (newToken) => {
          setToken(newToken);
          localStorage.setItem("token", newToken);
     };

     const logout = () => {
          setToken(null);
          localStorage.removeItem("token");
     };

     const isAuthenticated = () => {
          return !!token;
     };

     return (
          <AuthContext.Provider value={ { token, login, logout, isAuthenticated } }>
               { children }
          </AuthContext.Provider>
     );
};
