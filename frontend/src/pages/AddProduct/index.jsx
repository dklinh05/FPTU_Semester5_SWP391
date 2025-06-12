import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { addProduct } from "../../services/productService";


function AddProduct() {
  const { userId } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    origin: "",
    category: "",
    unit: "", // Thêm unit vào formData
    image: null,
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
    const productData = new FormData();
    productData.append("userId", userId);
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("origin", formData.origin);
    productData.append("category", formData.category);
    productData.append("unit", formData.unit);
    productData.append("stockQuantity", formData.stockQuantity);
    if (formData.image) {
      productData.append("image", formData.image);
    }
    console.log(userId)
    try {
      const response = await addProduct(productData);
      alert("Thêm sản phẩm thành công! Yêu cầu duyệt sẽ được gửi đến admin.");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert("Thêm sản phẩm thất bại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4" encType="multipart/form-data">
      <h3>Thêm Sản Phẩm Mới</h3>

      {/* Tên sản phẩm */}
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

      {/* Mô tả */}
      <div className="mb-3">
        <label className="form-label">Mô tả</label>
        <textarea
          name="description"
          className="form-control"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Giá */}
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

      {/* Đơn vị */}
      <div className="mb-3">
        <label className="form-label">Đơn vị</label>
        <select
          name="unit"
          className="form-select"
          value={formData.unit}
          onChange={handleChange}
          required
        >
          <option value="">Chọn đơn vị</option>
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="cái">cái</option>
          <option value="chục">chục</option>
        </select>
      </div>

      {/* Số lượng tồn kho */}
      <div className="mb-3">
        <label className="form-label">Số lượng tồn kho</label>
        <input
          type="number"
          name="stockQuantity"
          className="form-control"
          value={formData.stockQuantity}
          onChange={handleChange}
          required
        />
      </div>

      {/* Xuất xứ */}
      <div className="mb-3">
        <label className="form-label">Xuất xứ</label>
        <input
          type="text"
          name="origin"
          className="form-control"
          value={formData.origin}
          onChange={handleChange}
          required
        />
      </div>

      {/* Danh mục */}
      <div className="mb-3">
        <label className="form-label">Danh mục</label>
        <select
          name="category"
          className="form-select"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Chọn danh mục</option>
          <option value="rau">Rau</option>
          <option value="củ, quả">Củ, quả</option>
          <option value="trái cây">Trái cây</option>
          <option value="thực phẩm">Thực phẩm</option>
        </select>
      </div>

      {/* Hình ảnh */}
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

      {/* Nút submit */}
      <button type="submit" className="btn btn-primary">
        Thêm sản phẩm
      </button>
    </form>
  );
}

export default AddProduct;