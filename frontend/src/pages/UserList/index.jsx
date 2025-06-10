import React from "react";

const UserList = () => {
  const users = [
    {
      id: "#12598",
      name: "John Doe",
      email: "test@gmail.com",
      phone: "1234567890",
      joinDate: "24 Nov, 2024 3:59 PM",
    },
    {
      id: "#12599",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "0987654321",
      joinDate: "20 Nov, 2024 1:45 PM",
    },
    // Bạn có thể thêm nhiều người dùng hơn ở đây
  ];

  return (
    <div className="main-content">
      {/* Header Section */}
      <div className="card-service-section px-0 px-md-0 px-lg-3">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center bg-teal py-3">
            {/* Import Button */}
            <div className="d-flex gap-2">
              <button className="btn btn-light d-flex align-items-center gap-2">
                <i className="fa-solid fa-cloud-arrow-up"></i> Import
              </button>
            </div>

            {/* Search Input */}
            <div className="search-box d-flex align-items-center">
              <i className="fas fa-search text-light me-2"></i>
              <input
                type="text"
                className="form-control border-0 bg-transparent text-light"
                placeholder="Search user"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Table Section */}
      <div className="product-section px-0 px-md-0 px-lg-3 mt-5">
        <div className="container">
          <div className="card shadow-sm border-0 border-radius-12">
            <div className="card-body p-4">
              {/* Title Row */}
              <div className="row align-items-center mb-3">
                <div className="col-12 col-md-auto d-flex">
                  <h5 className="fw-bold text-start text-md-start">User List</h5>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3">ID</th>
                      <th scope="col" className="py-3">Name</th>
                      <th scope="col" className="py-3">Email</th>
                      <th scope="col" className="py-3">Phone</th>
                      <th scope="col" className="py-3">Join Date</th>
                      <th scope="col" className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.joinDate}</td>
                        <td className="d-flex">
                          <a href="#" className="btn btn-sm me-2">
                            <i className="fa-solid fa-edit"></i>
                          </a>
                          <a href="#" className="btn btn-sm me-2">
                            <i className="fa-solid fa-trash"></i>
                          </a>
                          <div className="dropdown">
                            <a
                              className="nav-link px-3 pt-1 pb-2"
                              href="#"
                              role="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </a>
                            <ul className="dropdown-menu">
                              <li>
                                <a className="dropdown-item py-2" href="#">
                                  Block
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
                <div>
                  <p className="text-center text-md-start">Showing 1 - 20 of 121</p>
                </div>
                <ul className="pagination">
                  <li>
                    <a href="#" className="pagination-link disabled" tabIndex="-1">
                      {/* < */}
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
                      {/* > */}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer text-center bg-white shadow-sm py-3 mt-5">
        <p className="m-0">
          Copyright © 2024. All Rights Reserved.{" "}
          <a
            href="https://www.templaterise.com/"
            className="text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Themes By TemplateRise
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserList;