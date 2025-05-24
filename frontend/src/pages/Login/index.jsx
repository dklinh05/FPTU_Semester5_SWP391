
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';

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
      alert('Đăng nhập thành công!');
      
      // Lưu token/user info nếu có
      localStorage.setItem('user', JSON.stringify(user));

      // Chuyển sang trang chính hoặc theo role
      navigate('/');
    } catch (error) {
      alert('Đăng nhập thất bại: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center">Đăng nhập</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
