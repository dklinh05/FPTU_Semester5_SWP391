import { request, formRequest } from "../utils/httpRequest";

export const addProduct = async (data) => {
  try {
    const response = await formRequest.post("/products", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderProduct = async () => {
  try {
    const response = await request.get("/products");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderBestSellerProduct = async () => {
  try {
    const response = await request.get("/products/best-sellers");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderProductByCategory = async (
  category,
  lat,
  lng,
  sortBy,
  sortDir,
  page,
  size
) => {
  try {
    const response = await request.get("/products/category", {
      params: {
        category,
        lat,
        lng,
        sortBy,
        sortDir,
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderProductById = async (id) => {
  try {
    const response = await request.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renderProductBySupplierId = async (
  id,
  sortBy,
  sortDir,
  page,
  size
) => {
  try {
    const response = await request.get(`/products/supplier/${id}`, {
      params: {
        sortBy,
        sortDir,
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await request.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchProducts = async (keyword, category, rating) => {
  try {
    const response = await request.get("/products/search", {
      params: { keyword, category, rating },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
