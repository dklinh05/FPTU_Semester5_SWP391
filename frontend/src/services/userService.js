import axios from "axios";
import request from '../utils/httpRequest';
const API_BASE = "http://localhost:8080/farmtrade/Users";

// export const getUserById = async (id) => {
//   const res = await axios.get(`${API_BASE}/${id}`);
//   return res.data;
// };
export const getUserById = async (id) => {
  const token = localStorage.getItem("token"); // Lấy token đã lưu sau khi đăng nhập

  const res = await axios.get(`${API_BASE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Gửi token như Postman
    },
    withCredentials: true, // nếu bạn vẫn muốn gửi cookie kèm theo
  });

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
  const response = await fetch(`${API_BASE}/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update user');
  return await response.json();
};

export const updateUserExtra = async (userId, extraData) => {
  try {
    const response = await request.put(`Users/google/${userId}`, extraData)
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
