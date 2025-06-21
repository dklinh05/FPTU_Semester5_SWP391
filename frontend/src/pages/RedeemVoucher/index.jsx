import React, { useState, useEffect } from "react";
import {
  redeemVoucher,
  renderVoucher,
  renderVoucherByUserId,
} from "../../services/voucherService";
import { useUser } from "../../context/UserContext";
import Header from "../../components/Header";
import ShopBanner from "../../layouts/components/ShopBanner";

function RedeemVoucher() {
  const { userId, points } = useUser();
  const [vouchers, setVouchers] = useState([]);
  const [ownedVouchers, setOwnedVouchers] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const [voucherList, userVouchers] = await Promise.all([
        renderVoucher(),
        renderVoucherByUserId(userId),
      ]);
      setVouchers(voucherList);
      setOwnedVouchers(userVouchers);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu.");
    }
  };

  const handleRedeem = async (voucherId) => {
    console.log(userId, voucherId)
    setMessage(null);
    setError(null);
    try {
      const response = await redeemVoucher(userId, voucherId);

      if (response) {
        setMessage("Đổi voucher thành công!");
        fetchData(); // Cập nhật lại danh sách nếu cần
      } else {
        setError(response || "Đổi voucher thất bại.");
      }
    } catch (err) {
      setError(err || "Đã có lỗi xảy ra.");
    }
  };

  return (
    <div>
      <Header />
      <ShopBanner />
      <div className="container py-5">
        <h2 className="text-center mb-3">
          Điểm của bạn: <span className="text-success">{points}</span>
        </h2>
        <h2 className="mb-4 text-center">Danh sách Voucher có thể đổi</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {vouchers.length === 0 ? (
            <p className="text-center">Hiện không có voucher nào khả dụng.</p>
          ) : (
            vouchers.map((voucher) => (
              <div className="col-md-4 mb-4" key={voucher.voucherID}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{voucher.name}</h5>
                    <p className="card-text">
                      Mã: <strong>{voucher.code}</strong>
                      <br />
                      Giảm: <strong>{voucher.discountValue}₫</strong>
                      <br />
                      Hạn: {voucher.expirationDate}
                      <br />
                      Giảm: <strong>{voucher.requiredPoints}₫</strong>
                    </p>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleRedeem(voucher.voucherID)}
                    >
                      Đổi ngay
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <hr className="my-5" />

        <h3 className="mb-4">Voucher bạn đã sở hữu</h3>
        <div className="row">
          {ownedVouchers.length === 0 ? (
            <p className="text-center">Bạn chưa sở hữu voucher nào.</p>
          ) : (
            ownedVouchers.map((voucher) => (
              <div className="col-md-4 mb-4" key={voucher.userVoucherID}>
                <div className="card h-100 border-success">
                  <div className="card-body">
                    <h5 className="card-title">{voucher.voucher.name}</h5>
                    <p className="card-text">
                      Mã: <strong>{voucher.voucher.code}</strong>
                      <br />
                      Giảm: <strong>{voucher.voucher.discountValue}₫</strong>
                      <br />
                      Hạn: {voucher.voucher.expirationDate}
                    </p>
                    <span className="badge bg-success">Đã sở hữu</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RedeemVoucher;
