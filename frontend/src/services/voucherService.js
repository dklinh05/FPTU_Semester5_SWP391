import { request, formRequest } from "../utils/httpRequest";

export const redeemVoucher = async (userId, voucherId) => {
  try {
    const response = await request.post("/voucher/users/redeem", {
      userId,
      voucherId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderVoucher = async () => {
  try {
    const response = await request.get("/voucher");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderVoucherByUserId = async (id) => {
  try {
    const response = await request.get(`/voucher/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};