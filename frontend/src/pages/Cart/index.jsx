import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { renderCart } from "../../services/cartItemService";
import CartItem from "../../layouts/components/CartItem";
import CartTotal from "../../layouts/components/CartTotal";

function Cart() {
  const { userId } = useUser();
  const [carts, setCarts] = useState([]);

  const getCarts = async () => {
    try {
      const response = await renderCart(userId);
      setCarts(response);
      // console.log("Response:", response);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getCarts();
    }
  }, [userId]);

  const handleItemDeleted = () => {
    getCarts(); // gọi lại API để cập nhật
  };

  const totalPrice = carts.reduce((total, cart) => {
  return total + cart.quantity * cart.product.price;
}, 0);

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        {/* Table Responsive */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Products</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {/* Product 1 */}
              {carts.map((cart, index) => (
                <CartItem
                  key={index}
                  id={cart.cartItemID}
                  quantity={cart.quantity}
                  img={cart.product.imageURL}
                  name={cart.product.name}
                  price={cart.product.price}
                  onDeleted={handleItemDeleted}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Coupon Code */}
        <div className="mt-5">
          <input
            type="text"
            className="border-0 border-bottom rounded me-5 py-3 mb-4"
            placeholder="Coupon Code"
          />
          <button
            className="btn border-secondary rounded-pill px-4 py-3 text-primary"
            type="button"
          >
            Apply Coupon
          </button>
        </div>

        {/* Cart Total */}
        <CartTotal total={totalPrice}/>
      </div>
    </div>
  );
}

export default Cart;
