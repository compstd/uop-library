import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/protected`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login failed! Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
