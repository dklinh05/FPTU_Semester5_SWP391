import {request, formRequest} from '../utils/httpRequest';

export const addOrder = async (data) =>{
  try {
    const response = await request.post('/orders', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}