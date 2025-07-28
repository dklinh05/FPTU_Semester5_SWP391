import { request } from "../utils/httpRequest";
import { jwtDecode } from "jwt-decode";

/**
 * Lấy danh sách cuộc trò chuyện của người dùng
 */
export const getConversationsByUserId = async (userId) => {
  const response = await request.get("/conversations", {
    params: { userId },
  });
  return response.data;
};

/**
 * Lấy danh sách tin nhắn theo conversationId
 */
export const getMessagesByConversationId = async (conversationId) => {
  const response = await request.get(`/conversations/${conversationId}/messages`);
  return response.data;
};

/**
 * Lấy danh sách thành viên trong cuộc trò chuyện
 */
export const getConversationMembers = async (conversationId) => {
  const response = await request.get(`/conversations/${conversationId}/members`);
  return response.data;
};

/**
 * Lấy danh sách sản phẩm của supplier (dùng để gửi trong chat)
 */
export const getSupplierProducts = async (supplierId) => {
  const response = await request.get(`/conversations/products/supplier/${supplierId}`);
  return response.data;
};

/**
 * Gửi tin nhắn văn bản
 */
export const sendMessage = async (conversationId, content) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập để gửi tin nhắn");
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const response = await request.post(`/conversations/${conversationId}/messages`, {
    conversationId: Number(conversationId),
    userId,
    content,
  });
  return response.data;
};

/**
 * Gửi tin nhắn chứa sản phẩm
 */
export const sendProductMessage = async (conversationId, senderId, productId) => {
  const response = await request.post(`/conversations/${conversationId}/product-message`, {
    senderId,
    productId,
  });
  return response.data;
};

/**
 * Lấy chi tiết sản phẩm
 */
export const getProductDetails = async (productId) => {
  const response = await request.get(`/products/${productId}`);
  return response.data;
};

/**
 * Lấy cuộc trò chuyện hiện tại giữa hai người
 */
export const getExistingConversation = async (userId, supplierId) => {
  const response = await request.get("/conversations/existing", {
    params: { userID1: userId, userID2: supplierId },
  });
  return response.data;
};

/**
 * Tạo cuộc trò chuyện mới
 */
export const createConversation = async (userIds, isGroup = false, name = "") => {
  if (!Array.isArray(userIds) || userIds.length < 2 || !userIds.every(id => Number.isInteger(id))) {
    throw new Error("userIds must be a valid array of integers with at least 2 elements");
  }

  const response = await request.post("/conversations", {
    userIDs: userIds,
    isGroup,
    name,
  });
  return response.data;
};