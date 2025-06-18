import { request, formRequest } from "../utils/httpRequest";

const API_BASE = "/users"; // ←←← Gọi đến backend qua http://localhost:8080/farmtrade/api/users

export const getUserById = async (id) => {
  const res = await request.get(`${API_BASE}/${id}`);
  return res.data;
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

