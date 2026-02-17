import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";

  type AuthContextValue = {
    mobileNumber: string | null;
    setMobileNoContex: (mobile: string | null) => void;
  };
  
  const AuthContext = createContext<AuthContextValue | undefined>(undefined);
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [mobileNumber, setMobileNumberState] = useState<string | null>(null);
  
    // Load from localStorage on first mount
    useEffect(() => {
      const stored = localStorage.getItem("mobileNumber");
      if (stored) {
        setMobileNumberState(stored);
      }
    }, []);
  
    // Wrapper so we also sync to localStorage
    const setMobileNoContex = (mobile: string | null) => {
      setMobileNumberState(mobile);
      if (mobile) {
        localStorage.setItem("mobileNumber", mobile);
      } else {
        localStorage.removeItem("mobileNumber");
      }
    };
  
    return (
      <AuthContext.Provider value={{ mobileNumber, setMobileNoContex }}>
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