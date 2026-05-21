import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext — Global authentication state.
 *
 * Provides:
 *   - user        : current logged-in user object (or null)
 *   - token       : JWT token string (or null)
 *   - login()     : saves token + user to localStorage and state
 *   - logout()    : clears everything
 *   - isLoggedIn  : boolean convenience flag
 *   - authLoading : true while reading from localStorage on startup
 */

// Create the context
const AuthContext = createContext(null);

// Keys used in localStorage
const TOKEN_KEY = 'turfzone_token';
const USER_KEY  = 'turfzone_user';

/**
 * AuthProvider — wrap your entire app with this.
 * It reads saved token/user from localStorage on first load
 * so the session survives page refresh.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser  = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Corrupt data — clear it
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setAuthLoading(false);
  }, []);

  /**
   * Call after successful login or signup.
   * Saves token and user info to state + localStorage.
   */
  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem(TOKEN_KEY, jwtToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  /**
   * Call on logout.
   * Clears everything from state and localStorage.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        authLoading,
        isLoggedIn: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — custom hook to consume AuthContext.
 * Usage: const { user, login, logout, isLoggedIn } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}

export default AuthContext;
