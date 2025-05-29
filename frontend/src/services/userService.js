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


export const updateUser = async (userID, userData) => {
  const response = await fetch(`${API_BASE}/${userID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)


//
export const updateUserExtra = async (userId, extraData) => {
  try {
    const response = await request.put(`Users/google/${userId}`,extraData)
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};




  });

  if (!response.ok) {
    throw new Error("Cập nhật thất bại");
  }

  return await response.json();
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