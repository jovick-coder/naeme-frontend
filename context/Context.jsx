import React, { createContext } from "react";

export const UserContext = new React.createContext(null);
export const LoadingContext = createContext(false);
export const AuthContext = createContext(false);
export const ErrorContext = createContext(false);
export const LogContext = createContext(false);
export const EventContext = createContext(null);
export const EventDataContext = createContext(null);
