import {request, formRequest} from '../utils/httpRequest';

export const addOrder = async (data) =>{
  try {
    const response = await request.post('/orders/ordersGroup', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export const renderOrdersByOrderGroupId = async (id) => {
  try {
    const response = await request.get(`/orders/group/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderOrderByBuyerId = async (id) => {
  try {
    const response = await request.get(`/orders/buyer/${id}`);
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