import axios from "axios";
import { useNavigate } from "react-router-dom";
console.log("API URL:", process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("JWT_TOKEN");
    console.log("token ",token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      
      alert("Your session has ended. Please click here to log in again."); 

      localStorage.removeItem("JWT_TOKEN");
      localStorage.removeItem("USER");
      localStorage.removeItem("CSRF_TOKEN");
      localStorage.removeItem("IS_ADMIN");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
