import * as httpRequest from '../utils/httpRequest';

export const registerUser = async (data) => {
  try {
    const response = await httpRequest.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};