import {request, formRequest} from '../utils/httpRequest';

export const addProduct = async (data) =>{
  try {
    const response = await request.post('/products', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}