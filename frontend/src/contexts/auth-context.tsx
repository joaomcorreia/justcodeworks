"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isStaff?: boolean;
  isSuperuser?: boolean;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = "http://localhost:8000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const isAuthenticated = user !== null && accessToken !== null;

  // Ensure client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check Django session authentication on mount
  useEffect(() => {
    if (!isClient) return;
    
    const checkAuthStatus = async () => {
      try {
        // Check if user is authenticated with Django session
        const response = await fetch(`${API_BASE}/auth/me/`, {
          credentials: "include",
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.authenticated && data.user) {
            const userData: User = {
              id: data.user.id?.toString(),
              email: data.user.email,
              firstName: data.user.first_name,
              lastName: data.user.last_name,
              isStaff: data.user.is_staff,
              isSuperuser: data.user.is_superuser,
            };
            
            setAccessToken("session");
            setUser(userData);
            
            // Store user data in localStorage
            localStorage.setItem("jcw_user", JSON.stringify(userData));
          } else {
            // Not authenticated, clear any stale data
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem("jcw_user");
            localStorage.removeItem("jcw_access_token");
          }
        } else {
          // Session expired or not authenticated
          setUser(null);
          setAccessToken(null);
          localStorage.removeItem("jcw_user");
          localStorage.removeItem("jcw_access_token");
        }
      } catch (error) {
        console.warn("Auth check failed:", error);
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [isClient]);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      // First, get CSRF token
      await fetch(`${API_BASE}/csrf/`, {
        credentials: "include",
      });

      // Get CSRF token from cookies
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      // Use Django session authentication
      const response = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers,
        credentials: "include", // Important for session cookies
        body: JSON.stringify({ username: email, password }),
      });

      // [AUTH] response handling - check for errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || `Login failed (${response.status})`;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      // [AUTH] validate response format from session login endpoint
      if (!data.success || !data.user) {
        console.error("Unexpected login response format:", data);
        throw new Error("Login failed - invalid response");
      }

      const userData: User = {
        id: data.user.id?.toString(),
        email: data.user.email,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        isStaff: data.user.is_staff,
        isSuperuser: data.user.is_superuser,
      };
      
      setAccessToken("session"); // Use session instead of JWT token
      setUser(userData);

      // Store only user data in localStorage (no JWT token needed)
      if (typeof window !== "undefined") {
        localStorage.setItem("jcw_user", JSON.stringify(userData));
        localStorage.removeItem("jcw_access_token"); // Remove old JWT token
      }
      
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call Django session logout endpoint
      await fetch(`${API_BASE}/auth/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.warn("Logout API call failed, clearing local state anyway:", error);
    }
    
    // Clear all auth state
    setUser(null);
    setAccessToken(null);
    
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("jcw_access_token");
      localStorage.removeItem("jcw_user");
      localStorage.removeItem("jcw_refresh_token");
      
      // Redirect to homepage instead of reloading
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading: isLoading || !isClient,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}