import React, { useEffect, useState } from "react";
import {
  renderBestSellerProduct,
  deleteProduct,
} from "../../services/productService";
import "./CardDashboard.module.scss";
import PopupModal from "../PopupModal/PopupModal";

function CardDashboard() {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts(0);
  }, []);

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const data = await renderBestSellerProduct(page, 6);
      setProducts(data?.content || []);
      setPageInfo({ number: data.number, totalPages: data.totalPages });
    } catch (error) {
      console.error("Lỗi khi fetch sản phẩm bán chạy:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.productID);
      fetchProducts(pageInfo.number);
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm:", error);
    } finally {
      setShowModal(false);
    }
  };

  return (
      <div className="product-section px-0 px-md-0 px-lg-3">
        <div className="container mt-5">
          <div className="card shadow-sm border-0 border-radius-12">
            <div className="card-body p-4">
              <div className="row align-items-center mb-3">
                <div className="col-12 col-md-auto mb-3 mb-md-0">
                  <h5 className="fw-bold text-start text-md-start">
                    Best Selling Products
                  </h5>
                </div>
              </div>

              {loading && (
                  <div className="d-flex justify-content-center py-4">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
              )}

              {!loading && (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                      <tr>
                        <th>Product ID</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Sales</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {products.length > 0 ? (
                          products.map((product) => (
                              <tr key={product.productID}>
                                <td>{product.productID}</td>
                                <td>
                                  <img
                                      src={product.imageURL}
                                      alt="Product"
                                      className="p-img-thumbnail"
                                      width="50"
                                  />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.sales}</td>
                                <td>{product.stockQuantity}</td>
                                <td>
                            <span
                                className={`status-badge ${
                                    product.status === "In Stock"
                                        ? "status-success"
                                        : "status-danger"
                                }`}
                            >
                              {product.status}
                            </span>
                                </td>
                                <td className="text-center">
                                  <button
                                      className="btn btn-sm d-flex align-items-center justify-content-center mx-auto"
                                      onClick={() => handleDeleteClick(product)}
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                            <td colSpan="8" className="text-center text-muted py-4">
                              Không có sản phẩm bán chạy.
                            </td>
                          </tr>
                      )}
                      </tbody>
                    </table>
                  </div>
              )}

              {!loading && (
                  <div className="d-flex justify-content-end mt-3">
                    {Array.from({ length: pageInfo.totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`btn btn-sm me-2 ${
                                i === pageInfo.number
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                            }`}
                            onClick={() => fetchProducts(i)}
                        >
                          {i + 1}
                        </button>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </div>

        <PopupModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirmDelete}
            title="Xác nhận xoá sản phẩm"
            body={`Bạn có chắc chắn muốn xoá sản phẩm "${selectedProduct?.name}" không?`}
            confirmText="Xoá"
            cancelText="Huỷ"
        />
      </div>
  );
}

export default CardDashboard;