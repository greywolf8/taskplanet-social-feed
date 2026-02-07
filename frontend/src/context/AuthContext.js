'use client';

import React, { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authAPI
        .getCurrentUser()
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw err;
    }
  };

  const signup = async (username, email, password) => {
    try {
      setError(null);
      const response = await authAPI.signup(username, email, password);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
