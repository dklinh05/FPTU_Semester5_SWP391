import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../services/userService";
import { useUser} from "../../context/UserContext";

const cx = classNames.bind(styles);

function Header() {
  const { user } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleClickAvatarUser = (e) => {
    if (!user) {
      e.preventDefault();
      alert("You need to log in");
      navigate("/login");
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Search: ${searchTerm}`);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    alert("Đăng xuất thành công!");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="container-fluid fixed-top">
      {/* Topbar */}
      <div className="container topbar bg-primary d-none d-lg-block">
        <div className="d-flex justify-content-between">
          <div className="top-info ps-2">
            <small className="me-3">
              <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
              <a href="#" className="text-white">
                123 Street, New York
              </a>
            </small>
            <small className="me-3">
              <i className="fas fa-envelope me-2 text-secondary"></i>
              <a href="#" className="text-white">
                Email@Example.com
              </a>
            </small>
          </div>
          <div className="top-link pe-2">
            <a href="#" className="text-white">
              <small className="text-white mx-2">Privacy Policy</small>/
            </a>
            <a href="#" className="text-white">
              <small className="text-white mx-2">Terms of Use</small>/
            </a>
            <a href="#" className="text-white">
              <small className="text-white ms-2">Sales and Refunds</small>
            </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="container px-0">
        <nav className="navbar navbar-light bg-white navbar-expand-xl">
          <a href="index.html" className="navbar-brand">
            <h1 className="text-primary display-6">Fruitables</h1>
          </a>
          <button
            className="navbar-toggler py-2 px-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars text-primary"></span>
          </button>
          <div
            className="collapse navbar-collapse bg-white"
            id="navbarCollapse"
          >
            <div className="navbar-nav mx-auto">
              <a href="/" className="nav-item nav-link active">
                Home
              </a>
              <a href="/shop" className="nav-item nav-link">
                Shop
              </a>
              <a href="/product" className="nav-item nav-link">
                Shop Detail
              </a>
              <div className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Pages
                </a>
                <div className="dropdown-menu m-0 bg-secondary rounded-0">
                  <a href="/cart" className="dropdown-item">
                    Cart
                  </a>
                  <a href="chackout.html" className="dropdown-item">
                    Chackout
                  </a>
                  <a href="/testimonial" className="dropdown-item">
                    Testimonial
                  </a>
                  <a href="404.html" className="dropdown-item">
                    404 Page
                  </a>
                </div>
              </div>
              <a href="/contact" className="nav-item nav-link">
                Contact
              </a>
            </div>
            <div className="d-flex align-items-center m-3 me-0">
              <button
                className="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                data-bs-toggle="modal"
                data-bs-target="#searchModal"
              >
                <i className="fas fa-search text-primary"></i>
              </button>

              <a href="/cart" className="position-relative me-4">
                <i className="fa fa-shopping-bag fa-2x"></i>
                <span
                  className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                  style={{
                    top: "-5px",
                    left: "15px",
                    height: "20px",
                    minWidth: "20px",
                  }}
                >
                  3
                </span>
              </a>

              <li
                className="dropdown list-unstyled m-0 p-0"
                onClick={handleClickAvatarUser}
              >
                <a
                  className="nav-link"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {/* User ava */}
                  {user?.avatar ? (
                    <img className={cx(styles.avatar)} src={user.avatar} alt="avatar" />
                  ) : (
                    <i className="fas fa-user fa-2x"></i>
                  )}
                </a>
                {user && (
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <li>
                      <a className="dropdown-item py-2" href="/profile">
                        <i className="fa-solid fa-user me-2 text-success"></i>
                        Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item py-2" href="/">
                        <i className="fa-solid fa-gear me-2 text-info"></i>
                        Setting
                      </a>
                    </li>
                    <li>
                      <div
                        className="dropdown-item py-2"
                        onClick={handleLogout}
                      >
                        <i className="fa-solid fa-right-from-bracket me-2 text-danger"></i>
                        Logout
                      </div>
                    </li>
                  </ul>
                )}
              </li>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
