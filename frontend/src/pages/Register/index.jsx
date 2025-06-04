import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import styles from "./Register.module.scss";

const cx = classNames.bind(styles);

const Register = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    passwordHash: "",
    businessName: "",
    certification: "",
    address: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: role,
    }));
  }, [role]);

  const handleRoleSelect = (role) => {
    setRole(role.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.passwordHash !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const response = await registerUser(formData);
      alert("Đăng ký thành công!");
      console.log("Đăng ký thành công:", response);
      navigate("/login");
    } catch (error) {
      alert("Đăng ký thất bại: " + error.message || error);
      console.error("Lỗi:", error);
    }
  };

  return (
    <div className="container mt-3" style={{ maxWidth: "500px" }}>
      <h3 className={cx(styles.title, "text-center")}>Register</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your Full Name"
            required
          />
        </div>
        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your Username"
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
        </div>
        <div className="mb-3">
          <label>Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            name="passwordHash"
            value={formData.passwordHash}
            onChange={handleChange}
            placeholder="Your Password"
            required
          />
        </div>
        <div className="mb-3">
          <label>Nhập lại mật khẩu</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Your Password"
            required
          />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your phone"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Chọn vai trò</label>
          <select
            className="form-select"
            value={role}
            onChange={handleRoleSelect}
            required
          >
            <option value="">-- Select Role --</option>
            <option value="Customer">Customer</option>
            <option value="Supplier">Supplier</option>
          </select>
        </div>
        {role === "Supplier" && (
          <>
            <div className="mb-3">
              <label>Business Name</label>
              <input
                type="text"
                className="form-control"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your Business Name"
                required
              />
            </div>
            <div className="mb-3">
              <label>Certification</label>
              <input
                type="text"
                className="form-control"
                name="certification"
                value={formData.certification}
                onChange={handleChange}
                placeholder="Your Certification"
                required
              />
            </div>
          </>
        )}
        {role === "Customer" && (
          <div className="mb-3">
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your Address"
              required
            />
          </div>
        )}
        <button type="submit" className="btn btn-success w-100">
          Đăng ký
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
        You have an account?
        <a class="text-primary" href="/login">
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;
