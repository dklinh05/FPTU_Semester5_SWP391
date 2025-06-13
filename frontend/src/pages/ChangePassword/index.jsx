import React, { useEffect, useState } from "react";
import { sendOtp, verifyOtp, changePassword } from "../../services/authService";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const { user,userId, setUser } = useUser();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await sendOtp(userId);
      alert("OTP đã được gửi đến email");
      setStep(2);
    } catch (err) {
      alert("Gửi OTP thất bại");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(otp);
      alert("Xác thực OTP thành công");
      setStep(3);
    } catch (err) {
      alert("OTP không đúng");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await changePassword(userId, oldPassword, newPassword);
      alert("Đổi mật khẩu thành công");
      navigate("/login");
    } catch (err) {
      alert("Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="text-center">Đổi mật khẩu</h2>
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
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
              <label>Mật khẩu cũ:</label>
              <input
                type="password"
                className="form-control"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
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
    </div>
  );
}

export default ChangePassword;
