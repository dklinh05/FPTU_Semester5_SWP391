import {request, formRequest} from '../utils/httpRequest';

export const addProductToCart = async (data) =>{
  try {
    const response = await request.post('/cart/add', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export const updateQuantityCart = async (data) =>{
  try {
    const response = await request.put('/cart/update', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export const renderCart = async (id) =>{
  try {
    const response = await request.get(`/cart/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export const deleteCartItem = async (id) =>{
  try {
    const response = await request.delete(`/cart/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export const countCartItems = async (userId) => {
  try {
    const response = await request.get(`/cart/count-items`, {
      params: { buyerId: userId }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đếm giỏ hàng:", error);
    return 0;
  }
};