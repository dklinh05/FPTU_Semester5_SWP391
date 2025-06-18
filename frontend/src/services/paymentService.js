import {request, formRequest} from '../utils/httpRequest';

export const createPayment = async (amount, orderGroupId) =>{
  try {
    const response = await request.post('/payment', {amount, orderGroupId});
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}