import request from '../utils/httpRequest';

export const registerUser = async (data) => {
  try {
    const response = await request.post('/Users', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await request.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};