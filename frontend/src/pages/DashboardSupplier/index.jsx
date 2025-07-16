import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { analysisOrder } from "../../services/orderService";
import {getBestSellersByShop, deleteProduct, updateProduct,} from "../../services/productService";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import EditProductModal from "/src/components/EditProductModal/EditProductModal"
import { toast } from "react-toastify";

function DashboardSupplier() {
  const { userId } = useUser();
  const [data, setData] = useState({});
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const getProducts = async () => {
    try {
      const response = await getBestSellersByShop(userId);
      setProducts(response);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await analysisOrder(userId, 7, 2025);
      setData(data);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleProductUpdate = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct.productID, updatedProduct);
      setShowEditModal(false);
      toast.success("Cập nhật sản phẩm thành công!");
      await getProducts();
    } catch (error) {
      toast.error("Lỗi khi cập nhật sản phẩm: " + error);
    }
  };

  useEffect(() => {
    if (userId) {
      getProducts();
      fetchData();
    }
  }, [userId]);

  return (
      <div className="main-content">
        <div className="extra-header"></div>
        <div className="card-service-section px-0 px-md-0 px-lg-3">
          <div className="container-fluid">
            <div className="row">
              <div>
                <div className="row">
                  <DashboardCard
                      name={"Month's Revenue"}
                      total={data.monthlyRevenue}
                      percentage={data.revenueChange}
                      title={"from last month"}
                  />
                  <DashboardCard
                      name={"Month's Orders"}
                      total={data.monthlyOrders}
                      percentage={data.orderChange}
                      title={"from last month"}
                  />
                </div>

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

                        <div className="table-responsive">
                          <table className="table align-middle">
                            <thead>
                            <tr>
                              <th className="py-3">Product ID</th>
                              <th className="py-3">Image</th>
                              <th className="py-3">Product Name</th>
                              <th className="py-3">Price</th>
                              <th className="py-3">Total Sales</th>
                              <th className="py-3">Stock</th>
                              <th className="py-3">Status</th>
                              <th className="py-3">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products?.map((product) => (
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
                                  <td>
                                    <button
                                        className="btn btn-sm me-1"
                                        onClick={() => handleEdit(product)}
                                    >
                                      <i className="fa-solid fa-edit"></i>
                                    </button>
                                  </td>
                                </tr>
                            ))}
                            </tbody>
                          </table>
                        </div>

                        {showEditModal && selectedProduct && (
                            <EditProductModal
                                product={selectedProduct}
                                onClose={() => setShowEditModal(false)}
                                onSave={handleProductUpdate}
                            />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default DashboardSupplier;
