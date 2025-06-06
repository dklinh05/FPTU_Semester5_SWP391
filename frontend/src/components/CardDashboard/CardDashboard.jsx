function CardDashboard() {
  return (
  <div>
      {/* Cards Section */}
      <div className="row">
        {/* Card 1: Today's Revenue */}
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

        {/* Card 2: Today's Orders */}
        <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6 mb-3">
          <div className="card shadow-sm border-0 border-radius-12">
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

        {/* Card 3: Today's Visitors */}
        <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6 mb-3">
          <div className="card shadow-sm border-0 border-radius-12">
            <div className="card-body p-4">
              <div className="row">
                <div className="col-10">
                  <h6 className="text-muted mb-2">Today's Visitors</h6>
                  <h3 className="fw-bold">36,524</h3>
                  <div className="d-flex align-items-center">
                    <span className="status-badge status-success">
                      <i className="fa-solid fa-arrow-up"></i> 4.8%
                    </span>
                    <span className="text-muted ms-2">from yesterday</span>
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

      {/* Best Selling Products Table Section */}
      <div className="product-section px-0 px-md-0 px-lg-3">
        <div className="container mt-5">
          <div className="card shadow-sm border-0 border-radius-12">
            <div className="card-body p-4">
              {/* Header Row with Title and Dropdowns */}
              <div className="row align-items-center mb-3">
                <div className="col-12 col-md-auto mb-3 mb-md-0">
                  <h5 className="fw-bold text-start text-md-start">Best Selling Products</h5>
                </div>
                <div className="col-12 col-md d-flex justify-content-end flex-wrap gap-2">
                  {/* Filter Dropdown */}
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
                  </div>

                  {/* Sort Dropdown */}
                  <div className="dropdown">
                    <a
                      className="nav-link custom-bg-primary text-white rounded px-3 py-2"
                      href="#"
                      id="SortMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Sort By: Relevance <i className="fa-solid fa-arrow-up-wide-short"></i>
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="SortMenuLink">
                      <li>
                        <a className="dropdown-item py-2" href="#">
                          Low to High
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item py-2" href="#">
                          High to Low
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDashboard;
