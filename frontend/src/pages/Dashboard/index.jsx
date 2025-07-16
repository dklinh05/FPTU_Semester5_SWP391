// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import CardDashboard from "../../components/CardDashboard";
import {
  fetchDashboardStats,
  getTopProducts,
  getUsersByRole,
} from "../../services/dashboardService"; // Bỏ `getNewUsersLastWeek`
import { getTokenFromCookie } from "../../services/authService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });

  // State cho các API còn lại
  const [topProducts, setTopProducts] = useState([]);
  const [usersByRole, setUsersByRole] = useState([]);

  // Tách gọi API riêng biệt
  const loadDashboardStats = async () => {
    try {
      const data = await fetchDashboardStats();
      console.log("Thống kê tổng quan:", data);
      setStats(data);
    } catch (error) {
      console.error("Lỗi khi tải thống kê tổng quan", error);
    }
  };

  const loadTopProducts = async () => {
    try {
      const data = await getTopProducts();
      console.log("Top sản phẩm:", data);
      setTopProducts(data || []);
    } catch (error) {
      console.error("Lỗi khi tải Top sản phẩm", error);
      setTopProducts([]);
    }
  };

  const loadUsersByRole = async () => {
    try {
      const data = await getUsersByRole();
      console.log("Người dùng theo vai trò:", data);
      setUsersByRole(data || []);
    } catch (error) {
      console.error("Lỗi khi tải Người dùng theo vai trò", error);
      setUsersByRole([]);
    }
  };

  // Hàm chính gọi từng API một
  useEffect(() => {
    const loadAllData = async () => {
      const token = getTokenFromCookie();
      if (!token) {
        console.warn("Chưa đăng nhập");
        return;
      }

      await loadDashboardStats(); // Thống kê tổng quan
      await loadTopProducts();    // Top sản phẩm
      await loadUsersByRole();    // Người dùng theo vai trò
    };

    loadAllData();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Bảng điều khiển quản trị</h2>
      <div className="row">
        {/* Top sản phẩm bán chạy */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body">
              <h5 className="card-title fw-bold">Top 5 sản phẩm bán chạy nhất</h5>
              <ul className="list-group list-group-flush">
                {topProducts && topProducts.length > 0 ? (
                    topProducts.map((product, index) => (
                        <li key={index} className="list-group-item">
                          <strong>{product.name}</strong> - {product.sales} đơn
                        </li>
                    ))
                ) : (
                    <li className="list-group-item text-center text-muted">Không có dữ liệu</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Người dùng theo vai trò */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body">
              <h5 className="card-title fw-bold">Số lượng người dùng theo vai trò</h5>
              <ul className="list-group list-group-flush">
                {usersByRole && usersByRole.length > 0 ? (
                    usersByRole.map((roleItem, index) => (
                        <li key={index} className="list-group-item">
                          <strong>{roleItem.role}</strong>: {roleItem.count} người
                        </li>
                    ))
                ) : (
                    <li className="list-group-item text-center text-muted">Không có dữ liệu</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Thống kê tổng quan */}
      <div className="row mb-4">
        <CardDashboard/>

    </div>
    </div>
  );
};

export default Dashboard;