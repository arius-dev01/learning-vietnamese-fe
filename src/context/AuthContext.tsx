import React, { ReactNode, useEffect, useState } from "react";
import { getInfor } from "../service/userService";

type User = {
  email: string;
  roleName: string;
  id: number;
  avatar: string;
  language: string;
  fullName: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<User | null>;
  logout: () => void;
};

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const res = await getInfor();
      setUser(res.data);
    } catch (err) {
      console.error("Không lấy được user", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string): Promise<User | null> => {
    localStorage.setItem("access_token", token);
    try {
      const res = await getInfor();
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Không lấy được user", err);
      setUser(null);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
