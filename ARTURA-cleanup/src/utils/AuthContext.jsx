import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import apiClient, { API_TOKEN_LS_KEY } from "./apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const mutateUser = useCallback(async () => {
    const token =
      localStorage.getItem(API_TOKEN_LS_KEY) ||
      localStorage.getItem("artura.sanctum.token.v2");

    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await apiClient.get("/user");
      setUser(response.data);
      return response.data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    mutateUser();
  }, [mutateUser]);

  const login = useCallback(
    async (emailOrUsername, password) => {
      try {
        // Jika user mengetik "admin", otomatis ubah ke "admin@artura.com"
        const normalizedEmail =
          String(emailOrUsername).trim().toLowerCase() === "admin"
            ? "admin@artura.com"
            : String(emailOrUsername).trim();

        const response = await apiClient.post("/login", {
          email: normalizedEmail,
          password,
        });

        const token = response.data?.token;
        if (token) {
          localStorage.setItem(API_TOKEN_LS_KEY, token);
          localStorage.setItem("artura.sanctum.token.v2", token);
          
          // Menyinkronkan sesi admin agar lolos ProtectedAdminRoute
          sessionStorage.setItem("artura.admin.auth", "true");
          localStorage.setItem(
            "artura.admin.session.v1",
            JSON.stringify({
              isAuthenticated: true,
              username: "admin",
              loginAt: new Date().toISOString(),
            })
          );
        }

        await mutateUser();
        return { success: true, user: response.data?.user };
      } catch (error) {
        return {
          success: false,
          message:
            error.response?.data?.message ||
            "Email atau password tidak sesuai.",
        };
      }
    },
    [mutateUser]
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/logout").catch(() => {});
    } finally {
      // Membersihkan token Sanctum & sesi admin secara menyeluruh
      localStorage.removeItem(API_TOKEN_LS_KEY);
      localStorage.removeItem("artura.sanctum.token.v2");
      sessionStorage.removeItem("artura.admin.auth");
      localStorage.removeItem("artura.admin.session.v1");
      setUser(null);
    }
    return { success: true, message: "Logout berhasil" };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      mutateUser,
      login,
      logout,
    }),
    [user, isLoading, mutateUser, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContext;
};