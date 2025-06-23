import React, { useState } from "react";
import "./SidebarAdmin.scss"; // Tạo file CSS riêng

const SidebarAdmin = () => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="collapse-sidebar d-none d-lg-block" onClick={() => setCollapsed(!collapsed)}>
        <span>
          <i className="fa-solid fa-chevron-left"></i>
        </span>
      </div>

      <div className="sidebar-header">
        <div className="lg-logo">
          <a href="index.html">
            <img src="./assets/images/logo.png" alt="logo large" />
          </a>
        </div>
        <div className="sm-logo">
          <a href="index.html">
            <img src="./assets/images/sm-logo.png" alt="logo small" />
          </a>
        </div>
      </div>

      <div className="sidebar-body custom-scrollbar">
        <ul className="sidebar-menu">
          <li className="sidebar-label">Menu</li>
          <li>
            <a href="index.html" className="text-black sidebar-link">
              <i className="fa-solid fa-house"></i>
              <p>Dashboard</p>
            </a>
          </li>

          {/* Products */}
          <li>
            <a
              href="#"
              className="text-black sidebar-link submenu-parent"
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu(2);
              }}
            >
              <i className="fa-brands fa-microsoft"></i>
              <p>
                Product Management <i className="fa-solid fa-angle-down right-icon"></i>
              </p>
            </a>
            <ul className={`sidebar-submenu ${activeSubmenu === 2 ? "open" : ""}`}>
              <li>
                <a href="/addproduct" className="submenu-link">
                  Add
                </a>
              </li>
              <li>
                <a href="/listproduct" className="submenu-link">
                  List
                </a>
              </li>
              <li>
                <a href="/requestproduct" className="submenu-link">
                  Request Product
                </a>
              </li>
            </ul>
          </li>

          {/* Order */}
          <li>
            <a
              href="#"
              className="text-black sidebar-link submenu-parent"
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu(3);
              }}
            >
              <i className="fa-solid fa-bucket"></i>
              <p>
                Order <i className="fa-solid fa-angle-down right-icon"></i>
              </p>
            </a>
            <ul className={`sidebar-submenu ${activeSubmenu === 3 ? "open" : ""}`}>
              <li>
                <a href="/orderlist" className="submenu-link">
                  List
                </a>
              </li>
            </ul>
          </li>

          {/* User Management */}
          <li>
            <a
              href="#"
              className="text-black sidebar-link submenu-parent"
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu(5); // Dùng index 5 cho submenu này
              }}
            >
              <i className="fa-regular fa-user"></i>
              <p>
                User Management <i className="fa-solid fa-angle-down right-icon"></i>
              </p>
            </a>
            <ul className={`sidebar-submenu ${activeSubmenu === 5 ? "open" : ""}`}>
              <li>
                <a href="/customerlist" className="submenu-link">
                  Customer
                </a>
              </li>
              <li>
                <a href="/supplierlist" className="submenu-link">
                  Supplier
                </a>
              </li>
              <li>
                <a href="/shipperlist" className="submenu-link">
                  Shipper
                </a>
              </li>
              <li>
                <a href="/acceptupdaterole" className="submenu-link">
                  Customer Request
                </a>
              </li>
            </ul>
          </li>

          {/* Page */}
          <li>
            <a
              href="#"
              className="text-black sidebar-link submenu-parent"
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu(4);
              }}
            >
              <i className="fa-solid fa-pager"></i>
              <p>
                Page <i className="fa-solid fa-angle-down right-icon"></i>
              </p>
            </a>
            <ul className={`sidebar-submenu ${activeSubmenu === 4 ? "open" : ""}`}>
              <li>
                <a href="/login" className="submenu-link">
                  Login
                </a>
              </li>
              <li>
                <a href="signup.html" className="submenu-link">
                  Signup
                </a>
              </li>
              <li>
                <a href="404.html" className="submenu-link">
                  404
                </a>
              </li>
            </ul>
          </li>

          <li className="sidebar-label">Other</li>

          <li>
            <a href="#" className="text-black sidebar-link">
              <i className="fa-regular fa-message"></i>
              <p>Message</p>
            </a>
          </li>
          <li>
            <a href="#" className="text-black sidebar-link">
              <i className="fa-solid fa-phone"></i>
              <p>Help & Support</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarAdmin;