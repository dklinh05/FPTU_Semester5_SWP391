import React, { useState } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);
const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await loginUser(formData);
      alert("Đăng nhập thành công!");
      if (!user) {
        alert("Đăng nhập thất bại: " + (error.message || "Lỗi không xác định"));
        return;
      }
      // Lưu token/user info nếu có
      localStorage.setItem("user", JSON.stringify(user));

      // Chuyển sang trang chính hoặc theo role
      navigate("/profile");
    } catch (error) {
      alert("Đăng nhập thất bại: " + (error.message || "Lỗi không xác định"));
    }
  };

  return (
    <div className={cx(styles.login, "container", "mt-5")} style={{ maxWidth: "400px" }}>
      <h3 className={cx(styles.title, "text-center")}>Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>

        <div className="text-center mt-3">
          <a href="http://localhost:8080/farmtrade/oauth2/authorization/google">
            <button
              type="button"
              className={cx("btn", styles["btn-submit"], "w-100")}
            >
              <img src="/googlelogo.png" alt="" /> Continue with Google
            </button>
          </a>
        </div>
        <button type="submit" className={cx("btn", styles["btn-login"], "w-100")}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
