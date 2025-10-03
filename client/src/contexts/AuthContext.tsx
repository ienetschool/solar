import { createContext, useContext, useState } from "react";

type UserRole = "admin" | "agent" | "user";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // todo: remove mock functionality
    const stored = localStorage.getItem("mockUser");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    // todo: remove mock functionality
    console.log("Login attempt:", email, password);
    
    let role: UserRole = "user";
    if (email.includes("admin")) role = "admin";
    else if (email.includes("agent")) role = "agent";
    
    const mockUser: User = {
      id: "1",
      name: email.split("@")[0],
      email,
      role,
    };
    
    setUser(mockUser);
    localStorage.setItem("mockUser", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mockUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
