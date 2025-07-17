import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import Cookies from "js-cookie";
import styles from "./Header.module.scss";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { searchProducts } from "../../services/productService";
import NotificationDropdown from "../NotificationDropdown";

const cx = classNames.bind(styles);

function Header() {
  const { user } = useUser();
  const { cartsLength } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Fetch gợi ý tìm kiếm sản phẩm
  useEffect(() => {
    if (searchTerm.trim().length >= 1) {
      const timer = setTimeout(() => {
        fetchSuggestions(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const fetchSuggestions = async (keyword) => {
    try {
      const results = await searchProducts(keyword);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setSuggestions([]);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      alert("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }
    navigate(`/products/search?keyword=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleLogout = () => {
    alert("Đăng xuất thành công!");
    localStorage.removeItem("token");
    Cookies.remove("accessToken");
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
              <Link
                to={
                  user?.role === "SUPPLIER"
                    ? "/dashboard-supplier"
                    : user?.role === "ADMIN"
                    ? "/dashboard"
                    : user?.role === "SHIPPER"
                    ? "/order-manage-shipping"
                    : "/request-upgrade-role"
                }
                className="text-white"
              >
                Seller Centre
              </Link>
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

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="ms-auto d-flex me-4 position-relative w-100"
          >
            <input
              type="text"
              name="keyword"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              className="form-control border border-secondary rounded-pill"
              placeholder="Search..."
              style={{ width: "900px", paddingLeft: "15px" }}
            />
            <button
              type="submit"
              className="btn btn-primary rounded-circle ms-2"
              style={{ width: "38px", height: "38px" }}
            >
              <i className="fas fa-search"></i>
            </button>

            {/* Dropdown gợi ý */}
            {showSuggestions && suggestions.length > 0 && (
              <div className={cx(styles.suggestions)}>
                <ul className="list-group shadow-sm">
                  {suggestions.map((product) => (
                    <li
                      key={product.productID}
                      onClick={() => handleProductClick(product.productID)}
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      style={{ cursor: "pointer" }}
                    >
                      {product.imageURL && (
                        <img
                          src={product.imageURL}
                          alt={product.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            marginRight: "10px",
                          }}
                        />
                      )}
                      <span>{product.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Thông báo không có kết quả */}
            {showSuggestions &&
              suggestions.length === 0 &&
              searchTerm.length >= 2 && (
                <div className={cx(styles.noResults)}>
                  Không tìm thấy sản phẩm
                </div>
              )}
          </form>

          <div className="d-flex align-items-center justify-content-end">
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
                  {cartsLength > 0 && (
                    <span
                      className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                      style={{
                        top: "-5px",
                        left: "15px",
                        height: "20px",
                        minWidth: "20px",
                      }}
                    >
                      {cartsLength}
                    </span>
                  )}
                </a>
                <NotificationDropdown />

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
                    style={{ transform: "translateX(-40%)" }}
                  >
                    <li>
                      <a className="dropdown-item py-2" href="/profile">
                        <i className="fa-solid fa-user me-2 text-success"></i>
                        Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item py-2" href="/orders/pending">
                        <i className="fa-solid fa-orcid me-2 text-info"></i>
                        My Purchase
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item py-2" href="/chat">
                        <i className="fa fa-comments me-2 text-primary"></i>
                        My Chat
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item py-2" href="/redeem-voucher">
                        <i className="fa-solid fa-ticket me-2 text-info"></i>
                        Redeem Voucher
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
                </li>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
