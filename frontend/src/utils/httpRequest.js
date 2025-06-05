import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:8080/farmtrade",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Thêm Interceptor
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Hoặc từ nơi bạn lưu JWT

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const formRequest = axios.create({
  baseURL: "http://localhost:8080/farmtrade",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

// Thêm Interceptor
formRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Hoặc từ nơi bạn lưu JWT

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export {request, formRequest};
