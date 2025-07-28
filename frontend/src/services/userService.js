// src/services/userService.js

import { request, formRequest } from "../utils/httpRequest";
import { getUserIdFromToken } from "./authService";

const API_BASE = "/users";

const checkAuthAndCall = async (apiCall) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập: Không tìm thấy token.");
  return await apiCall();
};

/**
 * Lấy thông tin người dùng theo ID
 */
export const getUserById = async (userId) => {
  try {
    const res = await request.get(`/users/${userId}`);
    return res.data;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin người dùng: ${error.message}`);
  }
};

/**
 * Gửi yêu cầu nâng cấp vai trò
 */
export const submitRoleUpgradeRequest = async (formData) => {
  const userId = parseInt(getUserIdFromToken(), 10);
  if (!userId) throw new Error("Không thể xác định userId từ token");

  formData.append("userId", userId);

  return checkAuthAndCall(async () =>
    formRequest.post(`${API_BASE}/request`, formData)
  );
};

/**
 * Cập nhật tên doanh nghiệp
 */
export const updateBusinessName = async (userId, businessName) => {
  try {
    const res = await request.put(`/users/${userId}/business-name`, { businessName });
    return res.data;
  } catch (error) {
    throw new Error(`Cập nhật Business Name thất bại: ${error.message}`);
  }
};

/**
 * Cập nhật thông tin người dùng
 */
export const updateUser = async (userId, data) => {
  try {
    const response = await request.put(`/users/${userId}`, data);

    if (response.data && response.data.success === true) {
      return response.data;
    }

    throw new Error(response.data.error || "Cập nhật thất bại");
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Upload ảnh đại diện
 */
export const uploadAvatar = async (userId, formData) => {
  try {
    const res = await formRequest.post(`/users/${userId}/avatar`, formData);
    return res.data; // { avatarUrl: '...' }
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Upload avatar thất bại";
    throw new Error(errorMessage);
  }
};

/**
 * Cập nhật thông tin bổ sung (Google)
 */
export const updateUserExtra = async (userId, extraData) => {
  try {
    const response = await request.put(`${API_BASE}/google/${userId}`, extraData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Khóa tài khoản người dùng (admin)
 */
export const blockUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Vui lòng đăng nhập.");
    }

    await request.put(`/admin/users/lock/${userId}`);
    return true;
  } catch (error) {
    throw new Error("Không thể khóa người dùng. Vui lòng thử lại.");
  }
};

/**
 * Mở khóa tài khoản người dùng (admin)
 */
export const unblockUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Vui lòng đăng nhập.");
    }

    await request.put(`/admin/users/unlock/${userId}`);
    return true;
  } catch (error) {
    throw new Error("Không thể mở khóa người dùng. Vui lòng thử lại.");
  }
};