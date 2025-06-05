import React, { useState } from "react";
import { addProduct } from "../../services/productService";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: null, // File ảnh
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("stockQuantity", formData.quantity);
    if (formData.image) {
      productData.append("image", formData.image);
    }
    try {
      const response = await addProduct(productData);

      alert("Thêm sản phẩm thành công!");
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container mt-4"
      encType="multipart/form-data"
    >
      <h3>Thêm Sản Phẩm Mới</h3>

      <div className="mb-3">
        <label className="form-label">Tên sản phẩm</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Mô tả</label>
        <textarea
          name="description"
          className="form-control"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Giá</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Số lượng</label>
        <input
          type="number"
          name="quantity"
          className="form-control"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Hình ảnh</label>
        <input
          type="file"
          name="image"
          className="form-control"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Thêm sản phẩm
      </button>
    </form>
  );
}

export default AddProduct;
