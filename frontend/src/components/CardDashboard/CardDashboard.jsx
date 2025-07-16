import React, { useEffect, useState } from "react";
import {
  renderBestSellerProduct,
  deleteProduct,
} from "../../services/productService";
import "./CardDashboard.module.scss";
import PopupModal from "../PopupModal/PopupModal";

function CardDashboard() {	function CardDashboard() {
  return (	  const [products, setProducts] = useState([]);
  <div>	  const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 1 });
      {/* Cards Section */}	  const [loading, setLoading] = useState(true);
      <div className="row">	  const [showModal, setShowModal] = useState(false);
        {/* Card 1: Today's Revenue */}	  const [selectedProduct, setSelectedProduct] = useState(null);
        <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6 mb-3">	
          <div className="card shadow-sm border-0 border-radius-12">	
            <div className="card-body p-4">	
              <div className="row">	
                <div className="col-10">	
                  <h6 className="text-muted mb-2">Today's Revenue</h6>	
                  <h3 className="fw-bold">₹15,00,000</h3>	
                  <div className="d-flex align-items-center">	
                    <span className="status-badge status-success">	
                      <i className="fa-solid fa-arrow-up"></i> 4.8%	
                    </span>	
                    <span className="text-muted ms-2">from yesterday</span>	
                  </div>	
                </div>	
                <div className="col-2 d-flex justify-content-center align-items-center">	
                  <i className="fa-solid fa-arrow-up-right-dots size-2 text-success"></i>	
                </div>	
              </div>	
            </div>	
          </div>	
        </div>	


        {/* Card 2: Today's Orders */}	  useEffect(() => {
        <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6 mb-3">	    fetchProducts(0);
          <div className="card shadow-sm border-0 border-radius-12">	  }, []);
            <div className="card-body p-4">	
              <div className="row">	
                <div className="col-10">	
                  <h6 className="text-muted mb-2">Today's Orders</h6>	
                  <h3 className="fw-bold">7,506</h3>	
                  <div className="d-flex align-items-center">	
                    <span className="status-badge status-danger">	
                      <i className="fa-solid fa-arrow-down"></i> 4.8%	
                    </span>	
                    <span className="text-muted ms-2">from yesterday</span>	
                  </div>	
                </div>	
                <div className="col-2 d-flex justify-content-center align-items-center">	
                  <i className="fa-solid fa-cart-plus size-2-5 text-success"></i>	
                </div>	
              </div>	
            </div>	
          </div>	
        </div>	


        {/* Card 3: Today's Visitors */}	  const fetchProducts = async (page) => {
        <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6 mb-3">	    setLoading(true);
          <div className="card shadow-sm border-0 border-radius-12">	    try {
            <div className="card-body p-4">	      const data = await renderBestSellerProduct(page, 6);
              <div className="row">	      setProducts(data?.content || []);
                <div className="col-10">	      setPageInfo({ number: data.number, totalPages: data.totalPages });
                  <h6 className="text-muted mb-2">Today's Visitors</h6>	    } catch (error) {
                  <h3 className="fw-bold">36,524</h3>	      console.error("Lỗi khi fetch sản phẩm bán chạy:", error);
                  <div className="d-flex align-items-center">	      setProducts([]);
                    <span className="status-badge status-success">	    } finally {
                      <i className="fa-solid fa-arrow-up"></i> 4.8%	      setLoading(false);
                    </span>	    }
                    <span className="text-muted ms-2">from yesterday</span>	  };
                  </div>	
                </div>	
                <div className="col-2 d-flex justify-content-center align-items-center">	
                  <i className="fa-solid fa-street-view size-2-5 text-success"></i>	
                </div>	
              </div>	
            </div>	
          </div>	
        </div>	
      </div>	


      {/* Best Selling Products Table Section */}	  const handleDeleteClick = (product) => {
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
      <div className="product-section px-0 px-md-0 px-lg-3">	      <div className="product-section px-0 px-md-0 px-lg-3">
        <div className="container mt-5">	        <div className="container mt-5">
          <div className="card shadow-sm border-0 border-radius-12">	          <div className="card shadow-sm border-0 border-radius-12">
            <div className="card-body p-4">	            <div className="card-body p-4">
              {/* Header Row with Title and Dropdowns */}	
              <div className="row align-items-center mb-3">	              <div className="row align-items-center mb-3">
                <div className="col-12 col-md-auto mb-3 mb-md-0">	                <div className="col-12 col-md-auto mb-3 mb-md-0">
                  <h5 className="fw-bold text-start text-md-start">Best Selling Products</h5>	                  <h5 className="fw-bold text-start text-md-start">
                    Best Selling Products
                  </h5>
                </div>	                </div>
                <div className="col-12 col-md d-flex justify-content-end flex-wrap gap-2">	              </div>
                  {/* Filter Dropdown */}	
                  <div className="dropdown">	              {loading && (
                    <a	                  <div className="d-flex justify-content-center py-4">
                      className="nav-link custom-bg-primary text-white rounded px-3 py-2"	                    <div className="spinner-border text-primary" role="status" />
                      href="#"	
                      id="FilterMenuLink"	
                      role="button"	
                      data-bs-toggle="dropdown"	
                      aria-expanded="false"	
                    >	
                      Filter By <i className="fas fa-filter"></i>	
                    </a>	
                    <ul className="dropdown-menu" aria-labelledby="FilterMenuLink">	
                      <li>	
                        <a className="dropdown-item py-2" href="#">	
                          In Stock	
                        </a>	
                      </li>	
                      <li>	
                        <a className="dropdown-item py-2" href="#">	
                          Out of Stock	
                        </a>	
                      </li>	
                    </ul>	
                  </div>	                  </div>
              )}


                  {/* Sort Dropdown */}	              {!loading && (
                  <div className="dropdown">	                  <div className="table-responsive">
                    <a	                    <table className="table align-middle">
                      className="nav-link custom-bg-primary text-white rounded px-3 py-2"	                      <thead>
                      href="#"	                      <tr>
                      id="SortMenuLink"	                        <th>Product ID</th>
                      role="button"	                        <th>Image</th>
                      data-bs-toggle="dropdown"	                        <th>Product Name</th>
                      aria-expanded="false"	                        <th>Price</th>
                    >	                        <th>Sales</th>
                      Sort By: Relevance <i className="fa-solid fa-arrow-up-wide-short"></i>	                        <th>Stock</th>
                    </a>	                        <th>Status</th>
                    <ul className="dropdown-menu" aria-labelledby="SortMenuLink">	                        <th>Actions</th>
                      <li>	                      </tr>
                        <a className="dropdown-item py-2" href="#">	                      </thead>
                          Low to High	                      <tbody>
                        </a>	                      {products.length > 0 ? (
                      </li>	                          products.map((product) => (
                      <li>	                              <tr key={product.productID}>
                        <a className="dropdown-item py-2" href="#">	                                <td>{product.productID}</td>
                          High to Low	                                <td>
                        </a>	                                  <img
                      </li>	                                      src={product.imageURL}
                    </ul>	                                      alt="Product"
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
                  </div>	                  </div>
                </div>	              )}
              </div>	


              {/* Table */}	              {!loading && (
              <div className="table-responsive">	                  <div className="d-flex justify-content-end mt-3">
                <table className="table align-middle">	                    {Array.from({ length: pageInfo.totalPages }, (_, i) => (
                  <thead>	                        <button
                    <tr>	                            key={i}
                      <th scope="col" className="py-3">	                            className={`btn btn-sm me-2 ${
                        Product ID	                                i === pageInfo.number
                      </th>	                                    ? "btn-primary"
                      <th scope="col" className="py-3">	                                    : "btn-outline-primary"
                        Image	                            }`}
                      </th>	                            onClick={() => fetchProducts(i)}
                      <th scope="col" className="py-3">	                        >
                        Product Name	                          {i + 1}
                      </th>	                        </button>
                      <th scope="col" className="py-3">	                    ))}
                        Price	                  </div>
                      </th>	              )}
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
                    <tr>	
                      <td>#12598</td>	
                      <td>	
                        <img	
                          src="./assets/images/p1.jfif"	
                          alt="Product Image"	
                          className="p-img-thumbnail"	
                        />	
                      </td>	
                      <td>Off-white shoulder wide...</td>	
                      <td>₹4,099</td>	
                      <td>1246</td>	
                      <td>25</td>	
                      <td>	
                        <span className="status-badge status-success">In Stock</span>	
                      </td>	
                      <td>	
                        <a href="#" className="btn btn-sm">	
                          <i className="fa-solid fa-edit"></i>	
                        </a>	
                        <a href="#" className="btn btn-sm">	
                          <i className="fa-solid fa-trash"></i>	
                        </a>	
                      </td>	
                    </tr>	
                    <tr>	
                      <td>#12598</td>	
                      <td>	
                        <img	
                          src="./assets/images/p2.jfif"	
                          alt="Product Image"	
                          className="p-img-thumbnail"	
                        />	
                      </td>	
                      <td>Green Velvet semi-sleeve...</td>	
                      <td>₹4,099</td>	
                      <td>1246</td>	
                      <td>25</td>	
                      <td>	
                        <span className="status-badge status-danger">Out of Stock</span>	
                      </td>	
                      <td>	
                        <a href="#" className="btn btn-sm">	
                          <i className="fa-solid fa-edit"></i>	
                        </a>	
                        <a href="#" className="btn btn-sm">	
                          <i className="fa-solid fa-trash"></i>	
                        </a>	
                      </td>	
                    </tr>	
                    <tr>	
                      <td>#12598</td>	
                      <td>	
                        <img	
                          src="./assets/images/p3.jfif"	
                          alt="Product Image"	
                          className="p-img-thumbnail"	
                        />	
                      </td>	
                      <td>Nike air max 2099</td>	
                      <td>₹4,099</td>	
                      <td>1246</td>	
                      <td>25</td>	
                      <td>	
                        <span className="status-badge status-info">Restock</span>	
                      </td>	
                      <td>	
                        <a href="#" className="btn btn-sm">	
                          <i className="fa-solid fa-edit"></i>	
                        </a>	
                        <a href="#" className="btn btn-sm">	
                          <i className="fa-solid fa-trash"></i>	
                        </a>	
                      </td>	
                    </tr>	
                  </tbody>	
                </table>	
              </div>	
            </div>	            </div>
          </div>	          </div>
        </div>	        </div>

        <PopupModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirmDelete}
            title="Xác nhận xoá sản phẩm"
            body={`Bạn có chắc chắn muốn xoá sản phẩm "${selectedProduct?.name}" không?`}
            confirmText="Xoá"
            cancelText="Huỷ"
        />
      </div>	      </div>
    </div>	
  );	  );
}	}


export default CardDashboard;	export default CardDashboard;
