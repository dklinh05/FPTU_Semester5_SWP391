import React, { useState } from "react";
import styles from "./SidebarAdmin.module.scss";

const SidebarAdmin = () => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div
        className={styles["collapse-sidebar"]}
        onClick={() => setCollapsed(!collapsed)}
      >
        <span>
          <i className="fa-solid fa-chevron-left"></i>
        </span>
      </div>

      <div className={styles["sidebar-header"]}>
        <div className={styles["lg-logo"]}>
          <a href="http://localhost:5173/">
            <span>FramTrade Admin</span>
          </a>
        </div>
      </div>

      <div className={`${styles["sidebar-body"]} custom-scrollbar`}>
        <ul className={styles["sidebar-menu"]}>
          <li className={styles["sidebar-label"]}>Menu</li>
          <li>
            <a href="/dashboard" className={`${styles["sidebar-link"]} text-black`}>
              <i className="fa-solid fa-house"></i>
              <p>Dashboard</p>
            </a>
          </li>

          {/* Products */}
          <li>
            <a
              href="#"
              className={`${styles["sidebar-link"]} ${styles["submenu-parent"]} text-black`}
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu(2);
              }}
            >
              <i className="fa-brands fa-microsoft"></i>
              <p>
                Product Management{" "}
                <i className={`fa-solid fa-angle-down ${styles["right-icon"]}`}></i>
              </p>
            </a>
            <ul
              className={`${styles["sidebar-submenu"]} ${
                activeSubmenu === 2 ? styles.open : ""
              }`}
            >
              <li>
                <a href="/admin/listproduct" className={styles["submenu-link"]}>
                  List
                </a>
              </li>
              <li>
                <a href="/requestproduct" className={styles["submenu-link"]}>
                  Request Product
                </a>
              </li>
            </ul>
          </li>

          {/* User Management */}
          <li>
            <a
              href="#"
              className={`${styles["sidebar-link"]} ${styles["submenu-parent"]} text-black`}
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu(5); // Dùng index 5 cho submenu này
              }}
            >
              <i className="fa-regular fa-user"></i>
              <p>
                User Management{" "}
                <i className={`fa-solid fa-angle-down ${styles["right-icon"]}`}></i>
              </p>
            </a>
            <ul
              className={`${styles["sidebar-submenu"]} ${
                activeSubmenu === 5 ? styles.open : ""
              }`}
            >
              <li>
                <a href="/customerlist" className={styles["submenu-link"]}>
                  Customer
                </a>
              </li>
              <li>
                <a href="/supplierlist" className={styles["submenu-link"]}>
                  Supplier
                </a>
              </li>
              <li>
                <a href="/shipperlist" className={styles["submenu-link"]}>
                  Shipper
                </a>
              </li>
              <li>
                <a href="/acceptupdaterole" className={styles["submenu-link"]}>
                  Customer Request
                </a>
                <a href="/handle-withdraw" className={styles["submenu-link"]}>
                  Withdraw Request
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarAdmin;