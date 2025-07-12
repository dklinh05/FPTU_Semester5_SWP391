import { request, formRequest } from "../utils/httpRequest";

// src/services/authService.js

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId; // hoặc 'sub' tùy backend encode gì vào token
    } catch (e) {
        console.error("Không thể giải mã token", e);
        return null;
    }
};

export const getTokenFromCookie = () => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith("accessToken=")) {
      return cookie.split("=")[1];
    }
  }
  return null;
};

export const registerUser = async (data) => {
  try {
    const response = await request.post("/users/register", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await request.post("/auth/login", data);
    return response.data.result;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const sendOtp = (userId) => {
  return request.post("auth/send-otp", {
    userId: userId,
  });
};

export const sendOtpForgot = (email) => {
  return request.post("auth/send-otp-forgot", {
    email: email,
  });
};

export const verifyOtp = (otp) => {
  return request.post("/auth/verify-otp", {
    token: otp,
  });
};

export const changePassword = (userId, oldPassword, newPassword) => {
  return request.post("/auth/change-password", {
    userId: userId,
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
};

export const resetPassword = (otp, newPassword) => {
  return request.post("/auth/reset-password", {
    token: otp,
    newPassword: newPassword,
  });
};