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

export const analysisOrder = async (id, month, year) => {
  try {
    const response = await request.get(
      `/orders/suppliers/${id}/dashboard/monthly`,
      {
        params: {
          month: month,
          year: year,
        },
      }
    );
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

export const renderOrdersByShipperId = async (id, status, page, pageSize) => {
  try {
    const response = await request.get(`/orders/shipper/${id}/orders`, {
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

export const updateStatusOrder = async (
  orderId,
  newStatus,
  supplierId,
  shipperId
) => {
  try {
    const response = await request.put(`/orders/update-status`, {
      orderId,
      newStatus,
      supplierId,
      shipperId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const assignShipper = async (orderId) => {
  try {
    const response = await request.put(`/orders/assign-shipper/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const calculateShip = async (latitude, longitude, supplierId) => {
  try {
    const response = await request.post("/orders/calculate-fee", {
      latitude,
      longitude,
      supplierId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
