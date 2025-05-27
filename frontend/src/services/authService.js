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

export const sendOtp = (userId) => {
  return request.post('auth/send-otp', {
    userId: userId
  });
};

export const sendOtpForgot = (email) => {
  return request.post('auth/send-otp-forgot', {
    email: email
  });
};

export const verifyOtp = (otp) => {
  return request.post('/auth/verify-otp', { 
    token: otp
  });
};

export const changePassword = (userId, oldPassword, newPassword) => {
  return request.post('/auth/change-password', { 
    userId: userId, 
    oldPassword: oldPassword,
    newPassword: newPassword
  });
};

export const resetPassword = (otp, newPassword) => {
  return request.post('/auth/reset-password', { 
    token: otp, 
    newPassword: newPassword
  });
};