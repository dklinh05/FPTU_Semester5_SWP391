import CardCustomer from "../../components/CardCustomer";

function CustomerManagement() {
  return (
    <>
      <div className="extra-header"></div>
      <div className="card-service-section px-0 px-md-0 px-lg-3">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center bg-teal">
            {/* Import Buttons */}
            <div className="d-flex gap-2">
              <button className="btn btn-light d-flex align-items-center gap-2">
                <i className="fa-solid fa-cloud-arrow-up"></i> Import
              </button>
            </div>

            {/* Search Input */}
            <div className="search-box align-items-center d-flex">
              <i className="fas fa-search text-light"></i>
              <input
                type="text"
                className="form-control border-0 bg-transparent text-light"
                placeholder="Search user"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="product-section px-0 px-md-0 px-lg-3 mt-80">
        <div className="container">
          <div className="card shadow-sm border-0 border-radius-12">
            <div className="card-body p-4">
              <div className="row align-items-center mb-3">
                {/* Title */}
                <div className="col-12 col-md-auto mb-0 mb-md-0 d-flex">
                  <h5 className="fw-bold text-start text-md-start">
                    User List
                  </h5>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3">
                        ID
                      </th>
                      <th scope="col" className="py-3">
                        Name
                      </th>
                      <th scope="col" className="py-3">
                        Email
                      </th>
                      <th scope="col" className="py-3">
                        Phone
                      </th>
                      <th scope="col" className="py-3">
                        Join Date
                      </th>
                      <th scope="col" className="py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <CardCustomer/>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div>
              <p className="mt-4 mt-sm-4 mt-md-4 mt-lg-1 text-center text-md-start">
                Showing 1 - 20 of 121
              </p>
            </div>
            <ul className="pagination">
              <li>
                <a href="#" className="pagination-link disabled" tabIndex="-1">
                  &lt;
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
                  &gt;
                </a>
              </li>
            </ul>
          </div>
          {/* End Pagination */}
        </div>
      </div>
    </>
  );
}

export default CustomerManagement;
