import axios from "axios";
import { request, formRequest } from "../utils/httpRequest";
const API_BASE = "http://localhost:8080/farmtrade/users";

// export const getUserById = async (id) => {
//   const res = await axios.get(`${API_BASE}/${id}`);
//   return res.data;
// };
export const getUserById = async (id) => {
  const res = await request.get(`users/${id}`);

  return res.data;
};

export const uploadAvatar = async (userId, formData) => {
  const res = await formRequest.put(`users/${userId}/avatar`, {
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text(); // <- Đoạn text gây lỗi
    console.error("Phản hồi lỗi từ backend:", errorText); // <-- In ra lỗi thật sự
    throw new Error("Upload avatar thất bại");
  }

  return await res.json();
};

// export const updateUser = async (userID, userData) => {
//   const response = await fetch(`http://localhost:8080/farmtrade/Users/${userID}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(userData),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("Phản hồi lỗi từ server:", errorText);
//     throw new Error(errorText || "Cập nhật thất bại");
//   }

//   return await response.json();
// };

export const updateUser = async (userId, data) => {
  const response = await request.put(`${userId}`, {
    body: data,
  });
  if (!response.ok) throw new Error("Failed to update user");
  return await response.json();
};

export const updateUserExtra = async (userId, extraData) => {
  try {
    const response = await request.put(`Users/google/${userId}`, extraData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
