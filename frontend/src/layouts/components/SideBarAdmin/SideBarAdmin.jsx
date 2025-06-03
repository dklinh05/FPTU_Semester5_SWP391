function SidebarAdmin() {
  return (
    <div className="sidebar">
      <div className="collapse-sidebar d-none d-lg-block">
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
            <a href="/dashboard" className="text-black sidebar-link active">
              <i className="fa-solid fa-house"></i>
              <p>Dashboard</p>
            </a>
          </li>

          <li>
            <a href="#" className="text-black sidebar-link submenu-parent">
              <i className="fa-solid fa-list"></i>
              <p>
                Category <i className="fa-solid fa-angle-down right-icon"></i>
              </p>
            </a>
            <ul className="sidebar-submenu">
              <li>
                <a href="category-add.html" className="submenu-link">
                  Add
                </a>
              </li>
              <li>
                <a href="category-list.html" className="submenu-link">
                  List
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a href="#" className="text-black sidebar-link submenu-parent">
              <i className="fa-brands fa-microsoft"></i>
              <p>
                Products <i className="fa-solid fa-angle-down right-icon"></i>
              </p>
            </a>
            <ul className="sidebar-submenu">
              <li>
                <a href="product-add.html" className="submenu-link">
                  Add
                </a>
              </li>
              <li>
                <a href="product-list.html" className="submenu-link">
                  List
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a href="#" className="text-black sidebar-link submenu-parent">
              <i className="fa-solid fa-bucket"></i>
              <p>
                Order <i className="fa-solid fa-angle-down right-icon"></i>
              </p>
            </a>
            <ul className="sidebar-submenu">
              <li>
                <a href="order-list.html" className="submenu-link">
                  List
                </a>
              </li>
              <li>
                <a href="order-details.html" className="submenu-link">
                  Details
                </a>
              </li>
              <li>
                <a href="invoice.html" className="submenu-link">
                  Invoice
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a href="/customer" className="text-black sidebar-link">
              <i className="fa-regular fa-user"></i>
              <p>Customers</p>
            </a>
          </li>

          <li>
            <a href="#" className="text-black sidebar-link submenu-parent">
              <i className="fa-solid fa-pager"></i>
              <p>
                Page <i className="fa-solid fa-angle-down right-icon"></i>
              </p>
            </a>
            <ul className="sidebar-submenu">
              <li>
                <a href="login.html" className="submenu-link">
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
            <a href="#" className="text-black sidebar-link submenu-parent">
              <i className="fa-solid fa-web-awesome"></i>
              <p>
                Components <i className="fa-solid fa-angle-down right-icon"></i>
              </p>
            </a>
            <ul className="sidebar-submenu">
              <li>
                <a href="basic-table.html" className="submenu-link">
                  Basic table
                </a>
              </li>
              <li>
                <a href="data-table.html" className="submenu-link">
                  Datatable
                </a>
              </li>
            </ul>
          </li>

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
}

export default SidebarAdmin;
