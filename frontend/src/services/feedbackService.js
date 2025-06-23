import {formRequest, request} from "../utils/httpRequest";

const BASE_URL = "/reviews";

export const submitReview = async (productId, formData) => {
    try {
        const response = await formRequest.post(`/reviews/${productId}`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getReviewsByProductId = async (productId) => {
    try {
        const response = await request.get(`/reviews/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};