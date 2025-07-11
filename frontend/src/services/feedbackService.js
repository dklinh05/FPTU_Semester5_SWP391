import {formRequest, request} from "../utils/httpRequest";

const BASE_URL = "/reviews";

export const submitReview = async (productId, formData) => {
    const response = await formRequest.post(`/reviews/${productId}`, formData);
    return response.data;
};

export const getReviewsByProductId = async (productId) => {
    try {
        const response = await request.get(`/reviews/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const checkIfReviewed = async (productId, orderId) => {
    try {
        const res = await request.get("/reviews/check-reviewed", {
            params: { productId, orderId },
            withCredentials: true,
        });
        return res.data === true;
    } catch (err) {
        console.error("Check reviewed error:", err);
        return false;
    }
};

export const getReviewDetail = async (productId, orderId) => {
    try {
        const res = await request.get(`/reviews/detail`, {
            params: { productId, orderId },
            withCredentials: true,
        });
        return res.data;
    } catch (err) {
        console.error("Get review detail error:", err);
        throw err;
    }
};

export const updateReview = async (reviewId, formData) => {
    try {
        const res = await formRequest.put(`/reviews/${reviewId}`, formData);
        return res.data;
    } catch (err) {
        console.error("Update review error:", err);
        throw err;
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const res = await request.delete(`/reviews/${reviewId}`, {
            withCredentials: true,
        });
        return res.data;
    } catch (err) {
        console.error("Delete review error:", err);
        throw err;
    }
};