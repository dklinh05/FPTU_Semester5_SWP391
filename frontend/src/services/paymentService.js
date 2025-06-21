import {request, formRequest} from '../utils/httpRequest';

export const createPayment = async (method,amount, orderGroupId) =>{
  try {
    const response = await request.post(`/${method}`, {amount, orderGroupId});
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}