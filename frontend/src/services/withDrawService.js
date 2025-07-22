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
