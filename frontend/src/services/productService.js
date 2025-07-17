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
    keyword, category, lat, lng, rating, latest, page, size
) => {
  try {
    const response = await request.get("/products/filter", {
      params: {
        keyword,
        category,
        lat,
        lng,
        rating,
        latest,
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
    status,
    sortBy,
    sortDir,
    page,
    size
) => {
  try {
    const params = {
      sortBy,
      sortDir,
      page,
      size,
    };
    if (status !== null) {
      params.status = status;
    }

    const response = await request.get(`/products/supplier/${id}`, {
      params,
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

export const getBestSellersByShop = async (sellerId) => {
  try {
    const response = await request.get(`/products/shop/${sellerId}/best-sellers`);
    return response.data.content || [];
  } catch (error) {
    console.error("Lỗi khi gọi API lấy top sản phẩm:", error);
    return [];
  }
};

export const renderAllProductsAdmin = async (page = 0, size = 10) => {
  const response = await request.get("/products/admin", {
    params: { page, size },
  });
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const formData = new FormData();
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  try {
    const response = await formRequest.put(`/products/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProductStatus = async (id, status) => {
  try {
    const response = await request.put(`/products/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};