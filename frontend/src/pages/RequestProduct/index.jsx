import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RequestProduct = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/farmtrade/products/pending"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm chờ duyệt", err);
        alert("Không thể tải danh sách sản phẩm");
      }
    };

    fetchPendingProducts();
  }, []);

  // Hàm cập nhật trạng thái sản phẩm
  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/farmtrade/products/${id}/status?status=${status}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Cập nhật thành công:", res.data);
      setProducts(products.filter((p) => p.productID !== id));
      toast.success("Cập nhật trạng thái thành công");
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Bạn cần đăng nhập để duyệt/xóa sản phẩm");
        window.location.href = "/login"; // chuyển hướng đến trang đăng nhập
      } else {
        alert(`Lỗi: ${err.message}`);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3>Danh sách sản phẩm chờ duyệt</h3>

      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Tên sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Xuất xứ</th>
            <th>Đơn vị</th>
            <th>Số lượng</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">
                Không có sản phẩm nào đang chờ duyệt
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.productID}>
                <td>{product.name}</td>
                <td>
                  {product.imageURL ? (
                    <img
                      src={product.imageURL}
                      alt="Sản phẩm"
                      style={{ width: "100px", height: "auto" }}
                    />
                  ) : (
                    "Chưa có ảnh"
                  )}
                </td>
                <td>{product.description}</td>
                <td>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </td>
                <td>{product.origin}</td>
                <td>{product.unit}</td>
                <td>{product.stockQuantity}</td>
                <td>
                  <span className="badge bg-warning text-dark">
                    {product.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() =>
                      handleUpdateStatus(product.productID, "Active")
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      handleUpdateStatus(product.productID, "Denied")
                    }
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestProduct;
