import { request, formRequest } from "../utils/httpRequest";

export const renderNotifications = async (id, page, size) => {
  try {
    const response = await request.get(`/notifications/${id}`, {
      params: {
        page: page || undefined,
        size: size || undefined,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const readNotifications = async (id) => {
  try {
    const response = await request.put(`/notifications/read/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
