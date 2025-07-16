import {request, formRequest} from '../utils/httpRequest';

export const renderNotifications = async (id) =>{
  try {
    const response = await request.get(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}