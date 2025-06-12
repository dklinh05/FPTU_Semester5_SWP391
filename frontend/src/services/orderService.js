import {request, formRequest} from '../utils/httpRequest';

export const addOrder = async (data) =>{
  try {
    const response = await request.post('/orders', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

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