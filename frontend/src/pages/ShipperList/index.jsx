import React, { useEffect, useState } from "react";
import { request } from "../../utils/httpRequest";
import { blockUser, unblockUser } from "../../services/userService"; // Import từ userService.js

const ShipperList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Vui lòng đăng nhập.");
          setLoading(false);
          return;
        }

        const response = await request.get("/users");
        const data = response.data;

        // Lọc ra chỉ những người có role là SHIPPER
        const shippers = data.filter(user => user.role === "SHIPPER");

        setUsers(shippers);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách shipper. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Hàm lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userID?.toString().includes(searchTerm)
  );

  // Xử lý khóa/mở khóa người dùng
  const handleBlockOrUnblockUser = async (userId, isBlocking) => {
    try {
      const isConfirmed = window.confirm(
        isBlocking
          ? "Bạn có chắc chắn muốn khóa tài khoản này?"
          : "Bạn có chắc chắn muốn mở khóa tài khoản này?"
      );
      if (!isConfirmed) return;

      if (isBlocking) {
        await blockUser(userId);
      } else {
        await unblockUser(userId);
      }

      // Cập nhật trạng thái trực tiếp trong state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.userID === userId
            ? { ...user, isLocked: isBlocking }
            : user
        )
      );

      alert(isBlocking ? "Khóa người dùng thành công!" : "Mở khóa người dùng thành công!");
    } catch (err) {
      alert(err.message || "Đã xảy ra lỗi khi thực hiện hành động.");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-danger">{error}</p>;

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
            <div className="search-box d-flex align-items-center flex-fill me-3">
              <i className="fas fa-search text-light me-2"></i>
              <input
                type="text"
                className="form-control border-0 bg-transparent text-light w-100"
                placeholder="Search shipper by username, fullname, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              <h5 className="fw-bold">Shipper List</h5>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Join Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.userID}>
                          <td>{user.userID ? `#${user.userID}` : "-"}</td>
                          <td>{user.username || "-"}</td>
                          <td>{user.fullName || "-"}</td>
                          <td>{user.email || "-"}</td>
                          <td>{user.phone || "-"}</td>
                          <td>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleString()
                              : "-"}
                          </td>
                          <td>
                            {user.isLocked ? (
                              <span className="badge bg-danger">Blocked</span>
                            ) : user.isActive ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-secondary">Inactive</span>
                            )}
                          </td>
                          <td className="d-flex">
                            <a href={`/edit-user/${user.userID}`} className="btn btn-sm me-2">
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
                                  <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleBlockOrUnblockUser(user.userID, !user.isLocked);
                                    }}
                                  >
                                    {user.isLocked ? "Unblock" : "Block"}
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          Không tìm thấy shipper nào phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperList;