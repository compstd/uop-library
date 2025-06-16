import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
   console.log(API_BASE_URL);

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
      const publicRoutes = ["/login", "/registration"];
      if (!publicRoutes.includes(window.location.pathname)) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, [navigate]);


  const login = async (email, password) => {
    setLoading(true);

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
   console.log(API_BASE_URL);
    try {
            const res = await axios.get(`${API_BASE_URL}/auth/login`, {
          email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
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
      await axios.post(
        "http://localhost:4000/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
