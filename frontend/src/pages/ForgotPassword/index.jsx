import React, { useEffect, useState } from "react";
import { sendOtpForgot, verifyOtp, resetPassword } from "../../services/authService";
import { getUserById } from "../../services/userService"; // hàm gọi API lấy user
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // 👇 Lấy email từ userId trong localStorage khi component load

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await sendOtpForgot(email);
      toast.success("OTP đã được gửi đến email");
      setStep(2);
    } catch (err) {
      toast.error("Gửi OTP thất bại");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(otp);
      toast.success("Xác thực OTP thành công");
      setStep(3);
    } catch (err) {
      toast.error("OTP không đúng");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    console.log(otp)
    try {
      await resetPassword(otp, newPassword);
      toast.success("Đổi mật khẩu thành công");
      navigate("/login");
    } catch (err) {
      toast.error("Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2>Đổi mật khẩu</h2>

      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <div className="mb-3">
            <label>Email đã đăng ký:</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Gửi OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <div className="mb-3">
            <label>Nhập OTP đã gửi:</label>
            <input
              type="text"
              className="form-control"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button className="btn btn-success" type="submit">
            Xác thực
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label>Mật khẩu mới:</label>
            <input
              type="password"
              className="form-control"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-warning" type="submit">
            Đổi mật khẩu
          </button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
