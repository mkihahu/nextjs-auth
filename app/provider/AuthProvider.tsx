"use client";

import {
  createContext,
  useActionState,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContextType, Role, User } from "../types";
import { apiClient } from "../lib/apiClient";

type LoginState = {
  success?: boolean;
  error?: string;
  user?: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginState, loginAction, isLoginPending] = useActionState(
    async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      try {
        const data = (await apiClient.login(email, password)) as unknown as {
          user: User;
        } | null;
        if (data) {
          setUser(data.user);
          return { ...prevState, success: true, user: data.user };
        } else {
          return { ...prevState, success: false, error: "Invalid credentials" };
        }
      } catch (error) {
        return { ...prevState, success: false, error: "An error occurred" };
      }
    },
    {
      error: undefined,
      success: undefined,
      user: undefined,
    } as LoginState,
  );

  const logout = async () => {
    try {
      const response = await apiClient.logout();
      if (response) {
        setUser(null);
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const hasPermission = (requiredRole: Role): boolean => {
    if (!user) return false;
    const roleHeirachy = {
      [Role.GUEST]: 0,
      [Role.USER]: 1,
      [Role.MANAGER]: 2,
      [Role.ADMIN]: 3,
    };
    return roleHeirachy[user.role] >= roleHeirachy[requiredRole];
  };

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser || null);
      } catch (error) {
        console.error("Failed to load user", error);
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginAction,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
