import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import {
  redeemVoucher,
  renderVoucher,
  renderVoucherByUserId,
} from "../../services/voucherService";
import CartItem from "../../layouts/components/CartItem";
import CartTotal from "../../layouts/components/CartTotal";

function Cart() {
  const location = useLocation();
  const { userId } = useUser();
  const { carts } = useCart();
  const [checkedItems, setCheckedItems] = useState({});
  const chooseCartItems = location.state?.cartItems || [];
  const [ownedVouchers, setOwnedVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState({});

  const getCarts = () => {
    try {
      const initialChecked = {};

      carts.forEach((cart) => {
        initialChecked[cart.cartItemID] = false;
      });

      chooseCartItems.forEach((cart) => {
        initialChecked[cart.cartItemID] = true;
      });

      setCheckedItems(initialChecked);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const getVoucher = async () => {
    try {
      const vouchers = await renderVoucherByUserId(userId);
      setOwnedVouchers(vouchers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userId) {
      getCarts();
      getVoucher();
    }
  }, [userId]);

  const handleItemDeleted = () => {
    getCarts(); // gọi lại API để cập nhật
  };

  const handleCheckItem = (id, checked) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const isAllChecked =
    carts.length > 0 && carts.every((cart) => checkedItems[cart.cartItemID]);

  const handleCheckAll = (e) => {
    const checked = e.target.checked;
    const newChecked = {};
    carts.forEach((cart) => {
      newChecked[cart.cartItemID] = checked;
    });
    setCheckedItems(newChecked);
  };

  // Danh sách item được chọn (dựa trên checkedItems)
  const selectedItems = carts.filter((cart) => checkedItems[cart.cartItemID]);

  const total = selectedItems.reduce((total, cart) => {
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
                <th scope="col" className="text-center align-middle">
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                    style={{ transform: "scale(1.3)" }}
                  />
                </th>
                <th scope="col">Products</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart) => (
                <CartItem
                  key={cart.cartItemID}
                  id={cart.cartItemID}
                  quantity={cart.quantity}
                  img={cart.product.imageURL}
                  name={cart.product.name}
                  price={cart.product.price}
                  onDeleted={handleItemDeleted}
                  checked={checkedItems[cart.cartItemID] || false}
                  onCheck={(checked) =>
                    handleCheckItem(cart.cartItemID, checked)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Coupon Code */}
        <select
          className="form-select border-0 border-bottom rounded me-5 py-3 mb-4"
          value={selectedVoucher?.userVoucherID || ""}
          onChange={(e) => {
            const selected = ownedVouchers.find(
              (v) => v.userVoucherID === parseInt(e.target.value)
            );
            if (selected) {
              setSelectedVoucher(selected);
            }
            if (total > selected.voucher.minOrderAmount) {
              setSelectedVoucher(selected);
              toast.success(
                `Đã áp dụng mã: ${selected.voucher.code} - Giảm ${selected.voucher.discountValue}₫`
              );
            } else {
              toast.error("Bạn chưa đủ điểm để sử dụng voucher này.");
            }
          }}
        >
          <option value="">Chọn voucher</option>
          {ownedVouchers.map((voucher) => (
            <option
              key={voucher.userVoucherID}
              value={voucher.userVoucherID}
              disabled={total < voucher.voucher.minOrderAmount}
            >
              {voucher.voucher.code} - Giảm {voucher.voucher.discountValue}₫ cho
              đơn từ {voucher.voucher.minOrderAmount}
              {total < voucher.voucher.minOrderAmount
                ? "(Không đủ mức tiền tối thiểu ✖)"
                : ""}
            </option>
          ))}
        </select>

        {/* Cart Total - truyền selectedItems */}
        <CartTotal carts={selectedItems} voucher={selectedVoucher} />
      </div>
    </div>
  );
}

export default Cart;
