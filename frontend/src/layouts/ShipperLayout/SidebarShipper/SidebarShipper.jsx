import React, { useState } from "react";
import styles from './SidebarShipper.module.scss'

function SidebarShipper() {
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
            <span>FramTrade Shipper</span>
          </a>
        </div>
      </div>

      <div className={styles["sidebar-body"] + " custom-scrollbar"}>
        <ul className={styles["sidebar-menu"]}>
          <li className={styles["sidebar-label"]}>Menu</li>
          <li>
            <a href="/dashboard-supplier" className={styles["sidebar-link"]}>
              <i className="fa-solid fa-house"></i>
              <p>Dashboard</p>
            </a>
          </li>

          {/* Order */}
          <li>
            <a
              href="#"
              className={`${styles["sidebar-link"]} ${styles["submenu-parent"]}`}
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu(3);
              }}
            >
              <i className="fa-solid fa-bucket"></i>
              <p>
                Order{" "}
                <i
                  className={`fa-solid fa-angle-down ${styles["right-icon"]}`}
                ></i>
              </p>
            </a>
            <ul
              className={`${styles["sidebar-submenu"]} ${
                activeSubmenu === 3 ? styles.open : ""
              }`}
            >
              <li>
                <a href="/order-manage-shipping" className={styles["submenu-link"]}>
                  List
                </a>
              </li>
            </ul>
          </li>

          <li className={styles["sidebar-label"]}>Other</li>

          <li>
            <a href="#" className={styles["sidebar-link"]}>
              <i className="fa-regular fa-message"></i>
              <p>Message</p>
            </a>
          </li>
          <li>
            <a href="#" className={styles["sidebar-link"]}>
              <i className="fa-solid fa-phone"></i>
              <p>Help & Support</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SidebarShipper;
