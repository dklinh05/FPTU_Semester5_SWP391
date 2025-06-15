// src/components/Header/Header.jsx

import React, { useState } from "react";
import classNames from "classnames/bind";
import Cookies from 'js-cookie';
import styles from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const cx = classNames.bind(styles);

function Header() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();


  // const handleClickAvatarUser = (e) => {
  //   if (!user) {
  //     e.preventDefault();
  //     alert("You need to log in");
  //     navigate("/login");
  //   }
  // };

  const handleSearch = (e) => {
    e.preventDefault(); // Ngăn submit form mặc định

    if (!searchTerm.trim()) {
      alert("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    // Điều hướng đến trang tìm kiếm
    navigate(`/products/search?keyword=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    alert("Đăng xuất thành công!");
    localStorage.removeItem("token");
    Cookies.remove('accessToken');
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
                <i className="fas fa-envelope me-2 text-secondary"></i>
                <a href="/" className="text-white">
                  farmtrade43@gmail.com
                </a>
              </small>
              <small className="me-3">
                <a href="/request" className="text-white">
                  Seller Centre
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
            <a href="/" className="navbar-brand">
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
                <form onSubmit={handleSearch} className="d-flex me-4">
                  <input
                      type="text"
                      name="keyword"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control border border-secondary rounded-pill"
                      placeholder="Search..."
                      style={{ width: "200px", paddingLeft: "15px" }}
                  />
                  <button
                      type="submit"
                      className="btn btn-primary rounded-circle ms-2"
                      style={{ width: "38px", height: "38px" }}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </form>

                {!user ? (
                    <div className="d-flex align-items-center">
                      <a
                          href="/login"
                          className="text-dark me-3 text-decoration-none"
                      >
                        Login
                      </a>
                      <a
                          href="/register"
                          className="text-primary text-decoration-none"
                      >
                        Register
                      </a>
                    </div>
                ) : (
                    <>
                      <a href="/cart" className="position-relative me-4">
                        <i className="fa fa-shopping-bag fa-2x"></i>
                        {/*<span*/}
                        {/*  className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"*/}
                        {/*  style={{*/}
                        {/*    top: "-5px",*/}
                        {/*    left: "15px",*/}
                        {/*    height: "20px",*/}
                        {/*    minWidth: "20px",*/}
                        {/*  }}*/}
                        {/*>*/}
                        {/*  3*/}
                        {/*</span>*/}
                      </a>

                      <li className="dropdown list-unstyled m-0 p-0">
                        <a
                            className="nav-link"
                            href="#"
                            id="navbarDropdownMenuLink"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                          {user?.avatar ? (
                              <img
                                  className={cx(styles.avatar)}
                                  src={user.avatar}
                                  alt="avatar"
                              />
                          ) : (
                              <i className="fas fa-user fa-2x"></i>
                          )}
                        </a>
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
                          {/*<li>*/}
                          {/*  <a className="dropdown-item py-2" href="/">*/}
                          {/*    <i className="fa-solid fa-gear me-2 text-info"></i>*/}
                          {/*    Setting*/}
                          {/*  </a>*/}
                          {/*</li>*/}
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
                      </li>
                    </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
  );
}

export default Header;
