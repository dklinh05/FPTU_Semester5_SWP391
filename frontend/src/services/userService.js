import request from '../utils/httpRequest';

export const getUserById = async (userId) => {
  try {
    const response = await request.get(`/Users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUserProfile = async (userId, formData) => {
  try {
    const response = await request.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
