import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CartTotal({ carts, voucher }) {
  const navigate = useNavigate();

  const handleProceedCheckout = () => {
    if (!carts?.length) {
      toast.error("Hãy chọn sản phẩm để tiếp tục");
    } else {
      navigate("/checkout", { state: { cartItems: carts, voucher: voucher } });
    }
  };

  const subtotal = useMemo(() => {
    return carts.reduce((sum, cart) => sum + cart.quantity * cart.product.price, 0);
  }, [carts]);

  const shippingFee = 30000;
  const discount = voucher?.voucher?.discountValue ?? 0;
  const total = subtotal  - discount;

  return (
    <div className="row g-4 justify-content-end">
      <div className="col-8"></div>
      <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
        <div className="bg-light rounded">
          <div className="p-4">
            <h1 className="display-6 mb-4">
              Cart <span className="fw-normal">Total</span>
            </h1>
            <div className="d-flex justify-content-between mb-4">
              <h5 className="mb-0 me-4">Subtotal:</h5>
              <p className="mb-0">{subtotal} VND</p>
            </div>
            {/* <div className="d-flex justify-content-between">
              <h5 className="mb-0 me-4">Shipping</h5>
              <div>
                <p className="mb-0"> {shippingFee} VND</p>
              </div>
            </div> */}
            <div className="d-flex justify-content-between">
              <h5 className="mb-0 me-4">Voucher</h5>
              <div>
                <p className="mb-0"> - {voucher?.voucher?.discountValue} VND</p>
              </div>
            </div>
          </div>
          <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
            <h5 className="mb-0 ps-4 me-4">Total</h5>
            <p className="mb-0 pe-4">{total} VND</p>
          </div>
          <button
            className="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
            type="button"
            onClick={handleProceedCheckout}
          >
            Proceed Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;
