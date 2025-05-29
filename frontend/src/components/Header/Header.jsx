import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { Search, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function Header({ account_name }) {
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Search: ${searchTerm}`);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

//   useEffect(() => {
//     const userJSON = localStorage.getItem("user");
//     if (userJSON) {
//       try {
//         const user = JSON.parse(userJSON);
//         setUsername(user.username);
//       } catch {
//         setUsername(null);
//       }
//     } else {
//       setUsername(null);
//     }
//   }, []);

  const handleLogout = () => {
    alert("Đăng xuất thành công!");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className={cx("header")}>
      <div className={cx("container")}>
        <div className="row align-items-center py-3 mx-0">
          {/* Logo */}
          <div className="row align-items-center py-3 mx-0">
            {/* Logo */}
            <div className="col-2 d-flex justify-content-start ps-4">
              <div
                className={cx("logo")}
                onClick={handleLogoClick}
                style={{ cursor: "pointer" }}
              >
                <img src="/public/logo.png" alt="Logo" />
              </div>
            </div>

            <div className="col-8 d-flex align-items-center">
              <form onSubmit={handleSearchSubmit} className={cx("searchForm")}>
                <div className="input-group">
                  <span
                    className={`input-group-text bg-white text-dark ${cx(
                      "inputGroupText"
                    )}`}
                  >
                    <Search size={20} />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    //placeholder="Tìm kiếm..."
                    className={`form-control ${cx("searchInput")}`}
                  />
                </div>
              </form>
            </div>

            <div className="col-2 d-flex justify-content-end pe-4">
              {account_name ? (
                <div className={cx("user")}>
                  <div
                    className={cx("username")}
                    onClick={() => navigate("/profile")}
                    style={{ cursor: "pointer" }}
                  >
                    {account_name}
                  </div>
                  <button
                    className={cx("logoutBtn")}
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className={cx("authButtons")}>
                  <button
                    className={cx("authButton")}
                    type="button"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                  <button
                    className={cx("authButton")}
                    type="button"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </div>
              )}
              <div className={styles.cartIcon}>
                <ShoppingCart size={28} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
