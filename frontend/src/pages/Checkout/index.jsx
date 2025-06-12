import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Header from "../../components/Header";
import ShopBanner from "../../layouts/components/ShopBanner";
import CheckoutItem from "../../layouts/components/CheckoutItem/CheckoutItem";
import Footer from "../../components/Footer";
import { addOrder } from "../../services/orderService";

function Checkout() {
  const { userId } = useUser();
  const location = useLocation();
  const chooseCartItems = location.state?.cartItems || [];
  // Group cart items by supplier name
  const groupedBySupplier = chooseCartItems.reduce((groups, cart) => {
    const supplierName = cart.product.supplier.fullName;
    if (!groups[supplierName]) {
      groups[supplierName] = [];
    }
    groups[supplierName].push(cart);
    return groups;
  }, {});

  const productOrderList = chooseCartItems.map((item) => ({
    productId: item.product.productID, // hoặc item.productId tùy vào cấu trúc
    quantity: item.quantity,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      buyerId: userId, // lấy từ context hoặc state
      status: "pending",
      items: productOrderList,
      voucherId: null, // hoặc để undefined nếu không dùng
    };

    try {
      const response = await addOrder(orderData);
      alert("Create Order success!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert("Thêm sản phẩm thất bại.");
    }
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
                <div className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                  <div className="col-12">
                    <div className="form-check text-start my-3">
                      <input
                        type="checkbox"
                        className="form-check-input bg-primary border-0"
                        id="Transfer-1"
                        name="Transfer"
                        value="Transfer"
                      />
                      <label className="form-check-label" htmlFor="Transfer-1">
                        Direct Bank Transfer
                      </label>
                    </div>
                    <p className="text-start text-dark">
                      Make your payment directly into our bank account. Please
                      use your Order ID as the payment reference. Your order
                      will not be shipped until the funds have cleared in our
                      account.
                    </p>
                  </div>
                </div>

                <div className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                  <div className="col-12">
                    <div className="form-check text-start my-3">
                      <input
                        type="checkbox"
                        className="form-check-input bg-primary border-0"
                        id="Payments-1"
                        name="Payments"
                        value="Payments"
                      />
                      <label className="form-check-label" htmlFor="Payments-1">
                        Check Payments
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                  <div className="col-12">
                    <div className="form-check text-start my-3">
                      <input
                        type="checkbox"
                        className="form-check-input bg-primary border-0"
                        id="Delivery-1"
                        name="Delivery"
                        value="Delivery"
                      />
                      <label className="form-check-label" htmlFor="Delivery-1">
                        Cash On Delivery
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                  <div className="col-12">
                    <div className="form-check text-start my-3">
                      <input
                        type="checkbox"
                        className="form-check-input bg-primary border-0"
                        id="Paypal-1"
                        name="Paypal"
                        value="Paypal"
                      />
                      <label className="form-check-label" htmlFor="Paypal-1">
                        Paypal
                      </label>
                    </div>
                  </div>
                </div>

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
