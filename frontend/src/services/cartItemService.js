import {request, formRequest} from '../utils/httpRequest';

export const addProductToCart = async (data) =>{
  try {
    const response = await request.post('/cart/add', data);
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