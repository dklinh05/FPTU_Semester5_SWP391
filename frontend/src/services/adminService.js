// src/services/adminService.js

import { request } from "../utils/httpRequest";
import { getTokenFromCookie } from "./authService";
const API_BASE = "/users"; // URL gốc cho RoleUpgrade APIs
const admin_base = "/admin"; // URL gốc cho Admin APIs

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

export const getRoleUpgradeRequestsByStatus = async (status) => {
  const url = `${admin_base}/request/filter/${status}`;
  console.log('Đường dẫn yêu cầu:', url);
  return checkAuthAndCall(async () => request.get(url));
};

/**
 * Phê duyệt yêu cầu nâng cấp
 * @param requestId ID của yêu cầu
 * @param adminNote Ghi chú của admin
 */
export const approveRoleUpgrade = async (requestId, adminNote) => {
  return checkAuthAndCall(async () =>
    request.post(`${admin_base}/request/approve/${requestId}`, {
      adminNote
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
    request.post(`${admin_base}/request/reject/${requestId}`, {
      requestId,
      adminNote,
    })
  );
};