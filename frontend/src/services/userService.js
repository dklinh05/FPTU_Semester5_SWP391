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
// import axios from "axios";
// import { request, formRequest } from "../utils/httpRequest";
// const API_BASE = "http://localhost:8080/farmtrade/users";

// // export const getUserById = async (id) => {
// //   const res = await axios.get(`${API_BASE}/${id}`);
// //   return res.data;
// // };
// export const getUserById = async (id) => {
//   const res = await request.get(`users/${id}`);

//   return res.data;
// };

// export const uploadAvatar = async (userId, formData) => {
//   const res = await formRequest.post(`users/${userId}/avatar`, {
//     body: formData,
//   });

//   if (!res.ok) {
//     const errorText = await res.text(); // <- Đoạn text gây lỗi
//     console.error("Phản hồi lỗi từ backend:", errorText); // <-- In ra lỗi thật sự
//     throw new Error("Upload avatar thất bại");
//   }

//   return await res.json();
// };

// // export const updateUser = async (userID, userData) => {
// //   const response = await fetch(`http://localhost:8080/farmtrade/Users/${userID}`, {
// //     method: "PUT",
// //     headers: {
// //       "Content-Type": "application/json"
// //     },
// //     body: JSON.stringify(userData),
// //   });

// //   if (!response.ok) {
// //     const errorText = await response.text();
// //     console.error("Phản hồi lỗi từ server:", errorText);
// //     throw new Error(errorText || "Cập nhật thất bại");
// //   }

// //   return await response.json();
// // }; 

// export const updateUser = async (userId, data) => {
//   const response = await formRequest.put(`users/${userId}`, {
//     body: data,
//   });
//   if (!response.ok) throw new Error("Failed to update user");
//   return await response.json();
// };

// export const updateUserExtra = async (userId, extraData) => {
//   try {
//     const response = await request.put(`Users/google/${userId}`, extraData);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };
