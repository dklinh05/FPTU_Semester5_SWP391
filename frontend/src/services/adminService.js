// src/services/adminService.js

import { request } from "../utils/httpRequest";
import { getTokenFromCookie } from "./authService";
const API_BASE = "/users"; // URL gốc cho RoleUpgrade APIs


// Kiểm tra token trước khi thực hiện bất kỳ request nào (tuỳ chọn)
const checkAuthAndCall = async (apiCall) => {
  const token = getTokenFromCookie();
  if (!token) {
    throw new Error("Vui lòng đăng nhập.");
  }

  return await apiCall();
};

/**
 * Lấy tất cả yêu cầu nâng cấp
 */
export const getAllRoleUpgradeRequests = async () => {
  return checkAuthAndCall(async () =>
    request.get(`${API_BASE}/request`)
  );
};

/**
 * Lọc yêu cầu theo trạng thái
 * @param status PENDING | APPROVED | REJECTED
 */
export const getRoleUpgradeRequestsByStatus = async (status) => {
  return checkAuthAndCall(async () =>
    request.get(`${API_BASE}/request/filter/${status}`)
  );
};

/**
 * Phê duyệt yêu cầu nâng cấp
 * @param requestId ID của yêu cầu
 * @param adminNote Ghi chú của admin
 */
export const approveRoleUpgrade = async (requestId, adminNote) => {
  return checkAuthAndCall(async () =>
    request.put(`${API_BASE}/request/approve`, {
      requestId,
      adminNote,
    })
  );
};

/**
 * Từ chối yêu cầu nâng cấp
 * @param requestId ID của yêu cầu
 * @param adminNote Ghi chú của admin
 */
export const rejectRoleUpgrade = async (requestId, adminNote) => {
  return checkAuthAndCall(async () =>
    request.put(`${API_BASE}/request/reject`, {
      requestId,
      adminNote,
    })
  );
};