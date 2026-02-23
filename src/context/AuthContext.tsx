import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import type { VerifyOtpResponse } from "../api/auth";

const AUTH_USER_KEY = "authUser";

export type AuthUser = VerifyOtpResponse;

type AuthContextValue = {
  mobileNumber: string | null;
  setMobileNoContex: (mobile: string | null) => void;
  /** Logged-in user/agent from verifyOTP response; available globally. */
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  /** True once we've checked localStorage and initial auth state is ready. */
  isAuthReady: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [mobileNumber, setMobileNumberState] = useState<string | null>(null);
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Load from localStorage on first mount
  useEffect(() => {
    try {
      const storedMobile = localStorage.getItem("mobileNumber");
      if (storedMobile) setMobileNumberState(storedMobile);

      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as AuthUser;
        setUserState(parsed);
      }
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  const setMobileNoContex = (mobile: string | null) => {
    setMobileNumberState(mobile);
    if (mobile) {
      localStorage.setItem("mobileNumber", mobile);
    } else {
      localStorage.removeItem("mobileNumber");
    }
  };

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      setMobileNumberState(newUser.agentMobile);
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
      setMobileNumberState(null);
      localStorage.removeItem("mobileNumber");
    }
  };

  return (
    <AuthContext.Provider value={{ mobileNumber, setMobileNoContex, user, setUser, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};