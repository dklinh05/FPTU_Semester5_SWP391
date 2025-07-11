// import { jwtDecode } from "jwt-decode";
// import { request } from "../utils/httpRequest";

// const API_BASE_URL = "/conversations";

// export const getExistingConversation = async (userId, supplierId) => {
//   console.log("getExistingConversation: userId =", userId, "supplierId =", supplierId);
//   const response = await request.get(`${API_BASE_URL}/existing`, {
//     params: { userID1: userId, userID2: supplierId },
//   });
//   return response.data;
// };



// export const createConversation = async (userIds, isGroup, name) => {
//   console.log("createConversation: userIds =", userIds, "isGroup =", isGroup, "name =", name);
//   if (!Array.isArray(userIds) || userIds.length < 2 || !userIds.every(id => Number.isInteger(id))) {
//     throw new Error("userIds must be a valid array of integers with at least 2 elements");
//   }
//   const response = await request.post(`${API_BASE_URL}/conversations`, {
//     userIds,
//     isGroup,
//     name,
//   });
//   return response.data;
// };


// chatService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/farmtrade';

export const getExistingConversation = async (userId, supplierId, token) => {
  console.log("getExistingConversation: userId =", userId, "supplierId =", supplierId, "token =", token);
  try {
    const response = await axios.get(`${API_BASE_URL}/conversations/existing`, {
      params: { userID1: userId, userID2: supplierId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("getExistingConversation error:", error.response?.data || error.message);
    throw error;
  }
};
export const createConversation = async (userIds, isGroup, name, token) => {
  console.log("createConversation: userIds =", userIds, "isGroup =", isGroup, "name =", name, "token =", token);
  if (!Array.isArray(userIds) || userIds.length < 2 || !userIds.every(id => Number.isInteger(id))) {
    throw new Error("userIds must be a valid array of integers with at least 2 elements");
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/conversations`, {
      userIDs: userIds,
      isGroup,
      name,
    }, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error("createConversation error:", error.response?.data || error.message);
    throw error;
  }
};

// Các phương thức khác (getMessages, sendMessage, v.v.) giữ nguyên

export const sendMessage = async (conversationId, content) => {
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).userId : null;
  console.log("sendMessage: userId =", userId, "conversationId =", conversationId);
  if (!userId) throw new Error("Vui lòng đăng nhập để gửi tin nhắn");

  try {
    const response = await request.post(`${API_BASE_URL}/${conversationId}/messages`, {
      conversationId,
      userID: userId,
      content,
    });
    console.log("sendMessage: response =", response.data);
    return response.data;
  } catch (error) {
    console.error("sendMessage error:", error);
    throw error;
  }
};

export const getMessages = async (conversationId) => {
  console.log("getMessages: conversationId =", conversationId);
  try {
    const response = await request.get(`${API_BASE_URL}/${conversationId}/messages`);
    console.log("getMessages: response =", response.data);
    return response.data;
  } catch (error) {
    console.error("getMessages error:", error);
    throw error;
  }
};