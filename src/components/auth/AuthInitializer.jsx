"use client";

import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";

const AuthInitializer = () => {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    // Initialize auth state when app starts
    initializeAuth();
  }, [initializeAuth]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;
