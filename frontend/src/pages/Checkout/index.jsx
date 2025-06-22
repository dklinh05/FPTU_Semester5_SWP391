import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import Header from "../../components/Header";
import ShopBanner from "../../layouts/components/ShopBanner";
import CheckoutItem from "../../layouts/components/CheckoutItem/CheckoutItem";
import Footer from "../../components/Footer";
import { addOrder } from "../../services/orderService";
import { createPayment } from "../../services/paymentService";
import AddressPopup from "../../components/AddressPopup";

function Checkout() {
  const { userId, user } = useUser();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const location = useLocation();
  const chooseCartItems = location.state?.cartItems || [];
  const chooseVoucher = location.state?.voucher || {};
  const [shippingAddress, setShippingAddress] = useState(user.address);
  const [showAddressForm, setShowAddressForm] = useState(false);


  // Group cart items by supplier name
  const groupedBySupplier = chooseCartItems.reduce((groups, cart) => {
    const supplierId = cart.product.supplier.userID;
    if (!groups[supplierId]) {
      groups[supplierId] = [];
    }
    groups[supplierId].push(cart);
    return groups;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      toast.error("Hãy chọn phương thức thanh toán để tiếp tục");
      return;
    }
    try {
      // Bước 2: Gửi đơn hàng cho từng nhóm
      const orderList = Object.entries(groupedBySupplier).map(
        ([supplierId, items]) => ({
          buyerId: userId,
          supplierId: parseInt(supplierId),
          status: "pending",
          address: shippingAddress,
          items: items.map((item) => ({
            productId: item.product.productID,
            quantity: item.quantity,
          })),
        })
      );

      const orderGroupData = {
        buyerId: userId,
        userVoucherId: chooseVoucher?.userVoucherID || null,
        orders: orderList,
      };

      const response = await addOrder(orderGroupData);
      const groupId = response.orderGroupID;
      const amount = response.totalAmount;

      console.log("Đã tạo đơn hàng:", groupId, amount);

      await handlePayment(amount, groupId);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert("Tạo đơn hàng thất bại.");
    }
  };

  const handlePayment = async (amount, groupId) => {
    try {
      const response = await createPayment(
        selectedPaymentMethod,
        amount,
        groupId
      );
      window.location.href = response?.data?.checkoutUrl;
      console.log("Response:", response);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  return (
    <div>
      <Header />
      <ShopBanner />
      <div className="container-fluid py-5">
        <div className="container py-5">
          <h1 className="mb-4">Billing details</h1>
          <form onSubmit={handleSubmit}>
            <div className="row g-5">
              <div className="col-md-12 col-lg-12 col-xl-12">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Shop</th>
                        <th scope="col">Products</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupedBySupplier).map(
                        ([supplierName, carts]) => (
                          <React.Fragment key={supplierName}>
                            <tr className="font-semibold text-lg mb-2">
                              {supplierName}
                            </tr>
                            {carts.map((cart, index) => (
                              <CheckoutItem
                                key={cart.cartItemID}
                                id={cart.cartItemID}
                                quantity={cart.quantity}
                                img={cart.product.imageURL}
                                name={cart.product.name}
                                price={cart.product.price}
                              />
                            ))}
                          </React.Fragment>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Payment Options */}
                <div className="my-4">
                  <h4 className="mb-3">Payment Methods</h4>

                  {/* Direct Bank Transfer */}
                  <div className="form-check border-bottom py-3">
                    <input
                      type="checkbox"
                      className="form-check-input bg-primary border-0"
                      id="Transfer"
                      name="paymentMethod"
                      value="payos"
                      checked={selectedPaymentMethod === "payos"}
                      onChange={() => handlePaymentMethodChange("payos")}
                    />
                    <label className="form-check-label" htmlFor="payos">
                      Direct Bank Transfer
                    </label>
                    <p className="text-dark mt-1">
                      Make your payment directly into our bank account. Please
                      use your Order ID as the payment reference.
                    </p>
                  </div>

                  {/* Paypal */}
                  <div className="form-check border-bottom py-3">
                    <input
                      type="checkbox"
                      className="form-check-input bg-primary border-0"
                      id="Paypal"
                      name="paymentMethod"
                      value="Paypal"
                      checked={selectedPaymentMethod === "paypal"}
                      onChange={() => handlePaymentMethodChange("paypal")}
                    />
                    <label className="form-check-label" htmlFor="Paypal">
                      Paypal
                    </label>
                    <p className="text-dark mt-1">
                      Secure payment via your PayPal account.
                    </p>
                  </div>

                  <div className="form-check border-bottom py-3">
                    <input
                      type="checkbox"
                      className="form-check-input bg-primary border-0"
                      id="Paypal"
                      name="paymentMethod"
                      value="vnpay"
                      checked={selectedPaymentMethod === "vnpay"}
                      onChange={() => handlePaymentMethodChange("vnpay")}
                    />
                    <label className="form-check-label" htmlFor="vnpay">
                      VNPay
                    </label>
                    <p className="text-dark mt-1">
                      Secure payment via your VNPay account.
                    </p>
                  </div>
                </div>
                {/* Voucher & Total Summary */}
                <div className="border-top pt-4 mt-4">
                  <h4 className="mb-3">Order Summary</h4>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>
                      $
                      {chooseCartItems.reduce(
                        (total, cart) =>
                          total + cart.quantity * cart.product.price,
                        0
                      )}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping Fee</span>
                    <span>$3.00</span>
                  </div>

                  {chooseVoucher?.voucher?.discountValue ? (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Voucher Discount</span>
                      <span>- ${chooseVoucher.voucher.discountValue}</span>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between mb-2 text-muted">
                      <span>No Voucher Applied</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between border-top pt-3 mt-3">
                    <strong>Total</strong>
                    <strong>
                      $
                      {chooseCartItems.reduce(
                        (total, cart) =>
                          total + cart.quantity * cart.product.price,
                        0
                      ) +
                        3 -
                        (chooseVoucher?.voucher?.discountValue ?? 0)}
                    </strong>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Địa chỉ giao hàng
                  </label>

                  {/* Hiển thị địa chỉ mặc định */}
                  {!showAddressForm && (
                    <div className="border p-3 bg-light rounded">
                      <p className="mb-1">{shippingAddress}</p>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary mt-2"
                        onClick={() => setShowAddressForm(true)}
                      >
                        Thay đổi địa chỉ
                      </button>
                    </div>
                  )}

                  {/* Hiển thị form thay đổi địa chỉ */}
                </div>
                <AddressPopup
                  isOpen={showAddressForm}
                  onClose={() => setShowAddressForm(false)}
                  shippingAddress={shippingAddress}
                  setShippingAddress={setShippingAddress}
                />
                {/* Place Order Button */}
                <div className="row g-4 text-center align-items-center justify-content-center pt-4">
                  <button
                    type="submit"
                    className="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;
