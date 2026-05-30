import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Interceptor to catch request before it been sent
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    
    // if have a token then send them with header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;