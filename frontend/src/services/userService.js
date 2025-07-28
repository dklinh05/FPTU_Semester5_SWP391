// userService.js
import { request, formRequest } from "../utils/httpRequest"; // ← THÊM DÒNG NÀY
import { getUserIdFromToken } from "./authService";

const API_BASE = "/users";

const checkAuthAndCall = async (apiCall) => {
  const token = localStorage.getItem("token");
  console.log("userService checkAuthAndCall: token =", token);
  if (!token) throw new Error("Vui lòng đăng nhập: Không tìm thấy token.");
  return await apiCall();
};

export const getUserById = async (userId) => {
  try {
    console.log("getUserById: userId =", userId);
    const res = await request.get(`/users/${userId}`);
    console.log("getUserById: response =", res.data);
    return res.data;
  } catch (error) {
    console.error("getUserById error:", error.response?.data || error.message);
    throw new Error(`Lỗi khi lấy thông tin người dùng: ${error.message}`);
  }
};

// Gửi yêu cầu nâng cấp
export const submitRoleUpgradeRequest = async (formData) => {
const userId = parseInt(getUserIdFromToken(), 10); // ← Chắc chắn là số nguyên
    if (!userId) throw new Error("Không thể xác định userId từ token");

    formData.append("userId", userId);

    return checkAuthAndCall(async () =>
        formRequest.post(`${API_BASE}/request`, formData)
    );
};

export const updateBusinessName = async (userId, businessName) => {
    try {
        const res = await request.put(`/users/${userId}/business-name`, { businessName });
        return res.data;
    } catch (error) {
        console.error("Lỗi cập nhật BusinessName:", error);
        throw new Error(`Cập nhật Business Name thất bại: ${error.message}`);
    }
};
export const updateUser = async (userId, data) => {
  try {
    const response = await request.put(`/users/${userId}`, data);

    // Nếu backend trả về { success: true }
    if (response.data && response.data.success === true) {
      return response.data; // Trả về dữ liệu thành công
    }


    // Nếu backend trả về lỗi rõ ràng
    throw new Error(response.data.error || "Cập nhật thất bại");
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const uploadAvatar = async (userId, formData) => {
  try {
    const res = await formRequest.post(`/users/${userId}/avatar`, formData);
    return res.data; // { avatarUrl: '...' }
  } catch (error) {
    let errorMessage = "Upload avatar thất bại";

    // Nếu backend trả về lỗi JSON
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error || errorMessage;
    }

    console.error("Phản hồi lỗi từ backend:", errorMessage);
    alert(errorMessage);
    throw new Error(errorMessage);
  }
}

export const updateUserExtra = async (userId, extraData) => {
  try {
    const response = await request.put(`${API_BASE}/google/${userId}`, extraData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Hàm khóa tài khoản người dùng
export const blockUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Vui lòng đăng nhập.");
    }

    // Gọi API khóa tài khoản
    await request.put(`/admin/users/lock/${userId}`);
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Không thể khóa người dùng. Vui lòng thử lại.");
  }
};

// Hàm mở khóa tài khoản người dùng
export const unblockUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Vui lòng đăng nhập.");
    }

    // Gọi API mở khóa tài khoản
    await request.put(`/admin/users/unlock/${userId}`);
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Không thể mở khóa người dùng. Vui lòng thử lại.");
  }
};

