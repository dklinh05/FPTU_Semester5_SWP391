import { request, formRequest } from "../utils/httpRequest";

export const withDrawRequest = async (
  supplierId,
  amountRequested,
  bankName,
  bankAccountNumber
) => {
  try {
    const response = await request.post("/withdraw", {
      supplierId,
      amountRequested,
      bankName,
      bankAccountNumber,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getWithdrawRequests = async ({
  page = 0,
  size = 10,
  status,
  supplierId,
}) => {
  try {
    const params = {
      page,
      size,
    };
    if (status) params.status = status;
    if (supplierId) params.supplierId = supplierId;

    const response = await request.get("/withdraw", { params });
    return response.data; // là 1 object Page<WithdrawRequest>
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const approveWithDraw = async (id) => {
  try {
    const response = await request.put(`/withdraw/approve/${id}`, "approve");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const rejectWithDraw = async (id) => {
  try {
    const response = await request.put(`/withdraw/reject/${id}`, "reject");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
