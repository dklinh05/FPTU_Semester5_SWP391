import React, { useState } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import styles from "./Register.module.scss";

const cx = classNames.bind(styles);

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const roles = ["Supplier", "Customer", "Shipper"];

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setRole(role);
    setStep(2);
  };

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    passwordHash: "",
    businessName: "",
    certification: "",
    address: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.passwordHash !== formData.confirmPassword) {
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
      {step === 1 && <h3 className={cx(styles.title, "text-center")}>Choose role</h3>}

      {step === 1 && (
        <div className={cx(styles["form-role"])}>
          {roles.map((role) => (
            <div
              key={role}
              onClick={() => handleRoleSelect(role)}
              className={styles["role-item"]}
            >
              <img
                src="/role.png" // đổi thành ảnh phù hợp
                alt={role}
                width="100"
              />
              <p>{role}</p>
            </div>
          ))}
        </div>
      )}
      {step === 2 && <h3 className={cx(styles.title, "text-center")}>Register for {role}</h3>}
      {step === 2 && (
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
          {role === "Supplier" && (
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
          )}
          {role === "Supplier" && (
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
      )}
    </div>
  );
};

export default Register;
