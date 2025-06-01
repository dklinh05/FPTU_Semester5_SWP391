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
        alert("Đăng nhập thất bại: ");
        return;
      }
      // Lưu token/user info nếu có
      localStorage.setItem("user", JSON.stringify(user));

      // Chuyển sang trang chính hoặc theo role
      navigate("/profile");
    } catch (error) {
      alert("Đăng nhập thất bại: ");
    }
  };

  return (
    <div
      className={cx(styles.login, "container", "mt-5")}
      style={{ maxWidth: "400px" }}
    >
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

        <button
          type="submit"
          className={cx("btn", styles["btn-login"], "w-100")}
        >
          Login
        </button>
      </form>
      <div class="my-4 d-flex align-items-center text-center">
        <span class="w-100 border-bottom border-secondary"></span>
        <span class="mx-2 text-uppercase small">Or</span>
        <span class="w-100 border-bottom border-secondary"></span>
      </div>
      <div class="d-flex flex-column flex-sm-row justify-content-center">
        <a
          href="http://localhost:8080/farmtrade/oauth2/authorization/google"
          class="mr-4 mb-3 py-3 btn btn-light w-100 d-flex align-items-center justify-content-center shadow-sm me-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="30"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
        </a>
      </div>
      <p class="mt-4 text-center">
        Don't have an account yet?
        <a class="text-primary" href="signup.html">
          Sign Up
        </a>
      </p>
      <p class="mt-4 text-center">
        Did you forget your password?
        <a class="text-primary" href="forgot-password.html">
          Recover Password
        </a>
      </p>
    </div>
  );
};

export default Login;
