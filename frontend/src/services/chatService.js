import axios from 'axios';
import { request } from "../utils/httpRequest"; // ← Thay axios bằng request


export const getExistingConversation = async (userId, supplierId) => {
  console.log("getExistingConversation: userId =", userId, "supplierId =", supplierId);
  try {
    const response = await request.get(`conversations/existing`, {
      params: { userID1: userId, userID2: supplierId },
    });
    return response.data;
  } catch (error) {
    console.error("getExistingConversation error:", error.response?.data || error.message);
    throw error;
  }
};

export const createConversation = async (userIds, isGroup = false, name = "") => {
  console.log("createConversation: userIds =", userIds, "isGroup =", isGroup, "name =", name);

  if (!Array.isArray(userIds) || userIds.length < 2 || !userIds.every(id => Number.isInteger(id))) {
    throw new Error("userIds must be a valid array of integers with at least 2 elements");
  }

  try {
    const response = await request.post("/conversations", {
      userIDs: userIds,
      isGroup,
      name,
    });
    return response.data;
  } catch (error) {
    console.error("createConversation error:", error.response?.data || error.message);
    throw error;
  }
};

export const sendMessage = async (conversationId, content) => {
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).userId : null;
  console.log("sendMessage: userId =", userId, "conversationId =", conversationId);

  if (!userId) throw new Error("Vui lòng đăng nhập để gửi tin nhắn");

  try {
    const response = await request.post(`/${conversationId}/messages`, {
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
    const response = await request.get(`/${conversationId}/messages`);
    console.log("getMessages: response =", response.data);
    return response.data;
  } catch (error) {
    console.error("getMessages error:", error);
    throw error;
  }
};