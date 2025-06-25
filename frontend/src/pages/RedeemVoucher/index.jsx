import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
    try {
      const response = await redeemVoucher(userId, voucherId);

      if (response) {
       toast.success("Đổi voucher thành công!");
        fetchData(); // Cập nhật lại danh sách nếu cần
      } else {
        toast.error(response || "Đã có lỗi xảy ra.");
      }
    } catch (err) {
      toast.error(err || "Đã có lỗi xảy ra.");
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
                      Expiry: {voucher.expirationDate}
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
                      Expiry: {voucher.voucher.expirationDate}
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
