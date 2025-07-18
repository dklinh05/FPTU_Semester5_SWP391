import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  redeemVoucher,
  renderVoucher,
  renderVoucherByUserId,
} from "../../services/voucherService";
import { formatDate } from "../../utils/formatDate";
import { useUser } from "../../context/UserContext";
import Header from "../../components/Header";
import ShopBanner from "../../layouts/components/ShopBanner";
import confetti from "canvas-confetti";

function RedeemVoucher() {
  const { userId, points,setPoints } = useUser();
  const [vouchers, setVouchers] = useState([]);
  const [ownedVouchers, setOwnedVouchers] = useState([]);

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
    try {
      const response = await redeemVoucher(userId, voucherId);

      if (response?.newPoints !== undefined) {
        toast.success("Đổi voucher thành công và điểm đã được cập nhật!");

        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            confetti({
              particleCount: 70,
              spread: 70 + i * 15,
              origin: { y: 0.6 },
              zIndex: 9999,
            });
          }, i * 300);
        }
        setPoints(response.newPoints);
        fetchData();
      } else {
        toast.error("Đã có lỗi xảy ra.");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 500) {
          toast.error("Lỗi hệ thống. Vui lòng thử lại sau.");
        } else {
          toast.error(err.response.data.message || "Đã có lỗi xảy ra.");
        }
      } else if (err.request) {
        toast.error("Không nhận được phản hồi từ server.");
      } else {
        toast.error(err.message);
      }
    }
  };


  return (
    <div>
      <Header />
      <ShopBanner />
      <div className="container py-5">
        <h2 className="text-center mb-3">
          Your point: <span className="text-success">{points}</span>
        </h2>
        <h2 className="mb-4 text-center">List of available vouchers to redeem:</h2>

        <div className="row">
          {vouchers.length === 0 ? (
            <p className="text-center">No available voucher!.</p>
          ) : (
            vouchers.map((voucher) => (
              <div className="col-md-4 mb-4" key={voucher.voucherID}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{voucher.name}</h5>
                    <p className="card-text">
                      Code: <strong>{voucher.code}</strong>
                      <br />
                      Description: <strong>{voucher.description}</strong>
                      <br />
                      Discount: <strong>{voucher.discountValue}₫</strong>
                      <br />
                      Expiry: {formatDate(voucher.expirationDate)}
                      <br />
                      Exchange points: <strong>{voucher.requiredPoints}</strong>
                    </p>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleRedeem(voucher.voucherID)}
                    >
                      Redeem now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <hr className="my-5" />

        <h3 className="mb-4">Vouchers you already own:</h3>
        <div className="row">
          {ownedVouchers.length === 0 ? (
            <p className="text-center">You dont have any voucher!</p>
          ) : (
            ownedVouchers.map((voucher) => (
              <div className="col-md-4 mb-4" key={voucher.userVoucherID}>
                <div className="card h-100 border-success">
                  <div className="card-body">
                    <h5 className="card-title">{voucher.voucher.name}</h5>
                    <p className="card-text">
                      Code: <strong>{voucher.voucher.code}</strong>
                      <br />
                      Discount: <strong>{voucher.voucher.discountValue}₫</strong>
                      <br />
                      Expiry: {formatDate(voucher.voucher.expirationDate)}
                    </p>
                    <span className="badge bg-success">Owned</span>
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
