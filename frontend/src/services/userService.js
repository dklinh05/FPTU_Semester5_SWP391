import axios from "axios";

const API_BASE = "http://localhost:8080/farmtrade/Users";

export const getUserById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export async function uploadAvatar(userId, file) {
  const formData = new FormData();
  formData.append("file", file); // key "file" phải đúng với tên trong @RequestParam

  const response = await fetch(`${API_BASE}/${userId}/avatar`, {
    method: "POST",
    body: formData,
    // KHÔNG set headers Content-Type → browser tự set với boundary
  });

  if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(`Upload avatar thất bại: ${errMsg}`);
  }

  const updatedUser = await response.json();
  return updatedUser;
}

export const updateUser = async (userId, userData) => {
  const response = await axios.put(`/farmtrade/Users/${userId}`, {
    fullName: userData.fullName,
    phone: userData.phone,
    username: userData.username,
    email: userData.email,
    passwordHash: userData.passwordHash || "placeholder123", // bắt buộc field
  });
  return response.data;
};

export const updateUsername = async (userId, username) => {
  const res = await axios.patch(`/Users/${userId}/username`, null, {
    params: { username },
  });
  return res.data;
};

export const updateFullName = async (userId, fullName) => {
  const res = await axios.patch(`/Users/${userId}/fullname`, null, {
    params: { fullName },
  });
  return res.data;
};

export const updatePhone = async (userId, phone) => {
  const res = await axios.patch(`/Users/${userId}/phone`, null, {
    params: { phone },
  });
  return res.data;
};

