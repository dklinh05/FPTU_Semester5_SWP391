import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { addProduct } from "../../services/productService";
import './AddProduct.scss';

function AddProduct() {
  const { userId } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    origin: "",
    category: "",
    unit: "",
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
    console.log(userId);
    try {
      const response = await addProduct(productData);
      toast.success("Thêm sản phẩm thành công! Yêu cầu duyệt sẽ được gửi đến admin.");
      navigate("/listproduct")
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert("Thêm sản phẩm thất bại.");
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="title-block">Thêm Sản Phẩm Mới</h2>
      <form onSubmit={handleSubmit} className="add-product-form" encType="multipart/form-data">
        <div className="form-group">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea
            name="description"
            className="form-textarea"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Giá</label>
          <input
            type="number"
            name="price"
            className="form-input"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
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

        <div className="form-group">
          <label className="form-label">Số lượng tồn kho</label>
          <input
            type="number"
            name="stockQuantity"
            className="form-input"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Xuất xứ</label>
          <input
            type="text"
            name="origin"
            className="form-input"
            value={formData.origin}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
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

        <div className="form-group">
          <label className="form-label">Hình ảnh</label>
          <input
            type="file"
            name="image"
            className="form-input"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="action-button submit-button">
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
}

export default AddProduct;