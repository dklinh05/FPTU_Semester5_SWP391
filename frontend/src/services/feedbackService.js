import {formRequest } from "../utils/httpRequest";

const BASE_URL = "/reviews";

export const submitReview = async (productId, formData) => {
    try {
        const response = await formRequest.post(`${BASE_URL}/${productId}`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchReviewsByProduct = async (productId) => {
    try {
        const response = await formRequest.get(`${BASE_URL}/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};