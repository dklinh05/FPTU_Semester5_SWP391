import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { analysisOrder } from "../../services/orderService";
import { getBestSellersByShop } from "../../services/productService";
import DashboardCard from "../../components/DashboardCard/DashboardCard";

function DashboardSupplier() {
  const { userId } = useUser();
  const [data, setData] = useState({});
  const [products, setProducts] = useState([]);

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

  useEffect(() => {
    if (userId) {
      getProducts();
      fetchData();
    }
  }, [userId]);

  return (
    <div className="main-content">
      <div className="extra-header"></div>
      <div class="card-service-section px-0 px-md-0 px-lg-3">
        <div class="container-fluid">
          <div class="row">
            <div>
              {/* Cards Section */}
              <div className="row">
                {/* Card 1: Today's Revenue */}
                <DashboardCard
                  name={"Month's Revenue"}
                  total={data.monthlyRevenue}
                  percentage={data.revenueChange}
                  title={"from last month"}
                />

                {/* Card 2: Today's Orders */}
                <DashboardCard
                  name={"Month's Orders"}
                  total={data.monthlyOrders}
                  percentage={data.orderChange}
                  title={"from last month"}
                />
              </div>

              {/* Best Selling Products Table Section */}
              <div className="product-section px-0 px-md-0 px-lg-3">
                <div className="container mt-5">
                  <div className="card shadow-sm border-0 border-radius-12">
                    <div className="card-body p-4">
                      {/* Header Row with Title and Dropdowns */}
                      <div className="row align-items-center mb-3">
                        <div className="col-12 col-md-auto mb-3 mb-md-0">
                          <h5 className="fw-bold text-start text-md-start">
                            Best Selling Products
                          </h5>
                        </div>
                        
                      </div>

                      {/* Table */}
                      <div className="table-responsive">
                        <table className="table align-middle">
                          <thead>
                            <tr>
                              <th scope="col" className="py-3">
                                Product ID
                              </th>
                              <th scope="col" className="py-3">
                                Image
                              </th>
                              <th scope="col" className="py-3">
                                Product Name
                              </th>
                              <th scope="col" className="py-3">
                                Price
                              </th>
                              <th scope="col" className="py-3">
                                Total Sales
                              </th>
                              <th scope="col" className="py-3">
                                Stock
                              </th>
                              <th scope="col" className="py-3">
                                Status
                              </th>
                              <th scope="col" className="py-3">
                                Actions
                              </th>
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
                                <td>{product.stockQuantity}</td>
                                <td>{product?.sales}</td>
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
                                  <a href="#" className="btn btn-sm me-1">
                                    <i className="fa-solid fa-edit"></i>
                                  </a>
                                  <btn className="btn btn-sm">
                                    <i className="fa-solid fa-trash"></i>
                                  </btn>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
