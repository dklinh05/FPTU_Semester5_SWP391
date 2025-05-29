import axios from "axios";
import request from '../utils/httpRequest';
const API_BASE = "http://localhost:8080/farmtrade/Users";

export const getUserById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const uploadAvatar = async (userId, formData) => {
  const res = await fetch(`http://localhost:8080/farmtrade/Users/${userId}/avatar`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text(); // <- Đoạn text gây lỗi
    console.error("Phản hồi lỗi từ backend:", errorText); // <-- In ra lỗi thật sự
    throw new Error("Upload avatar thất bại");
  }

  return await res.json();
};


//
export const updateUserExtra = async (userId, extraData) => {
  try {
    const response = await request.put(`Users/google/${userId}`,extraData)
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



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