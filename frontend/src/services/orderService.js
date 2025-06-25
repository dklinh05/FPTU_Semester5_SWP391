import { request, formRequest } from "../utils/httpRequest";

export const addOrder = async (data) => {
  try {
    const response = await request.post("/orders/ordersGroup", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderOrdersByOrderGroupId = async (id) => {
  try {
    const response = await request.get(`/orders/group/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderOrderById = async (id) => {
  try {
    const response = await request.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderOrderByBuyerId = async (id, status) => {
  try {
    const response = await request.get(`/orders/buyer/${id}`, {
      params: {
        status: status,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderOrderItemsByOrderId = async (id) => {
  try {
    const response = await request.get(`/orders/${id}/items`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderOrderGroupByBuyerId = async (id) => {
  try {
    const response = await request.get(`/orders/ordersGroup/buyer/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderOrdersBySupplierId = async (id, status, page, pageSize) => {
  try {
    const response = await request.get(`/orders/supplier/${id}/orders`, {
      params: {
        status: status || null, // hoặc undefined nếu không filter
        page: page, // trang đầu tiên
        size: pageSize || 5, // số phần tử mỗi trang
        sortBy: "orderDate,desc", // sắp xếp
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const cancelOrder = async (id) => {
  try {
    const response = await request.put(`/orders/cancel/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateStatusOrder = async (orderId, newStatus, supplierId) => {
  try {
    const response = await request.put(`/orders/update-status`, {
      orderId,
      newStatus,
      supplierId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
