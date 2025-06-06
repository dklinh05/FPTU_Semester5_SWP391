import React, { useState } from "react";

const ListProduct = () => {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const products = [
    {
      id: "#12598",
      name: "Off-white shoulder wide...",
      category: "Women",
      price: "₹4,099",
      stock: 25,
      sku: "123456",
      status: "In Stock",
      image: "./assets/images/p1.jfif",
    },
    {
      id: "#12599",
      name: "Blue denim jacket",
      category: "Men",
      price: "₹3,299",
      stock: 15,
      sku: "654321",
      status: "Out of Stock",
      image: "./assets/images/p1.jfif",
    },
  ];

  const handleSelectAll = (e) => {
    const newSelected = new Set();
    if (e.target.checked) {
      products.forEach((product) => newSelected.add(product.id));
    }
    setSelectedItems(newSelected);
  };

  const handleSelectRow = (id) => {
    const updated = new Set(selectedItems);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedItems(updated);
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?")) {
      alert("Xóa thành công!");
    }
  };

  return (
    <>
      {/* Header section - Added from your HTML */}
      <div className="card-service-section px-0 px-md-0 px-lg-3">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center bg-teal py-3">
            {/* Import and Export Buttons (visible only on lg screens) */}
            <div className="d-none d-lg-flex gap-2">
              <button className="btn btn-light d-flex align-items-center gap-2">
                <i className="fa-solid fa-cloud-arrow-up"></i> Import
              </button>
              <button className="btn btn-light d-flex align-items-center gap-2">
                <i className="fa-solid fa-cloud-arrow-down"></i> Export
              </button>
              {/* Add Product Button */}
              <a href="/add-product" className="btn btn-light d-flex align-items-center gap-2">
                <i className="fas fa-plus"></i> Add Product
              </a>
            </div>

            {/* Search Input */}
            <div className="search-box d-flex align-items-center">
              <i className="fas fa-search text-light me-2"></i>
              <input
                type="text"
                className="form-control border-0 bg-transparent text-light"
                placeholder="Search product"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="product-section px-0 px-md-0 px-lg-3 mt-5">
        <div className="container">
          <div className="card shadow-sm border-0 border-radius-12">
            <div className="card-body p-4">
              {/* Header Row */}
              <div className="row align-items-center mb-3">
                <div className="col-12 col-lg-8 d-flex justify-content-between justify-content-lg-start mb-3 mb-lg-0">
                  <h5 className="fw-bold text-start">Product List</h5>
                  <button
                    className="btn bg-disabled d-flex align-items-center ms-4"
                    onClick={handleDelete}
                  >
                    <i className="fas fa-trash"></i> <span className="ms-2">Delete</span>
                  </button>
                </div>

                <div className="col-12 col-lg-4 d-flex justify-content-end flex-wrap gap-2">
                  <div className="dropdown">
                    <a
                      className="nav-link custom-bg-primary text-white rounded px-3 py-2"
                      href="#"
                      id="FilterMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Filter By <i className="fas fa-filter"></i>
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="FilterMenuLink"
                    >
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
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3">
                        <input
                          type="checkbox"
                          id="select-all"
                          className="custom-checkbox"
                          onChange={handleSelectAll}
                          checked={selectedItems.size === products.length}
                        />
                      </th>
                      <th scope="col" className="py-3">Product ID</th>
                      <th scope="col" className="py-3">Image</th>
                      <th scope="col" className="py-3">Product Name</th>
                      <th scope="col" className="py-3">Category</th>
                      <th scope="col" className="py-3">Price</th>
                      <th scope="col" className="py-3">Stock</th>
                      <th scope="col" className="py-3">SKU</th>
                      <th scope="col" className="py-3">Status</th>
                      <th scope="col" className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <input
                            type="checkbox"
                            className="custom-checkbox row-checkbox"
                            checked={selectedItems.has(product.id)}
                            onChange={() => handleSelectRow(product.id)}
                          />
                        </td>
                        <td>{product.id}</td>
                        <td>
                          <img
                            src={product.image}
                            alt="Product"
                            className="p-img-thumbnail"
                            width="50"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td>{product.sku}</td>
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
                          <a href="#" className="btn btn-sm">
                            <i className="fa-solid fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
                <div>
                  <p className="text-center text-md-start">
                    Showing 1 - 20 of 121
                  </p>
                </div>
                <ul className="pagination">
                  <li>
                    <a
                      href="#"
                      className="pagination-link disabled"
                      tabIndex="-1"
                    >
                      <i className="fa-solid fa-angle-left"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="pagination-link active">
                      1
                    </a>
                  </li>
                  <li>
                    <a href="#" className="pagination-link">
                      2
                    </a>
                  </li>
                  <li>
                    <a href="#" className="pagination-link">
                      3
                    </a>
                  </li>
                  <li>
                    <a href="#" className="pagination-link">
                      4
                    </a>
                  </li>
                  <li>
                    <a href="#" className="pagination-link">
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListProduct;