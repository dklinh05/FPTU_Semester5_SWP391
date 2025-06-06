import {request, formRequest} from '../utils/httpRequest';

export const addProduct = async (data) =>{
  try {
    const response = await formRequest.post('/products', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export const renderProduct = async (data) =>{
  try {
    const response = await request.get('/products');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}