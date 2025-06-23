// httpRequest.js
import axios from "axios";

// Dùng cho API JSON thông thường
const request = axios.create({
  baseURL: "http://localhost:8080/farmtrade",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const formRequest = axios.create({
  baseURL: "http://localhost:8080/farmtrade",
  withCredentials: true,
});

// Interceptor thêm token vào header
const authInterceptor = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

request.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error)
);
formRequest.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error)
);

export { request, formRequest };