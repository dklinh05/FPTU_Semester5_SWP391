import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import {
  
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
  const [isUpdate, setIsUpdate] = useState(false);

  const onUpdateQuantity = () => {
    setIsUpdate((prev) => {
      console.log(!prev); // sẽ thấy giá trị thay đổi đúng
      return !prev;
    });
  };

  const getCarts = () => {
    try {
      setCheckedItems((prevChecked) => {
        const updatedChecked = { ...prevChecked };

        // Đảm bảo tất cả cartItemID đều có key
        carts.forEach((cart) => {
          if (!(cart.cartItemID in updatedChecked)) {
            updatedChecked[cart.cartItemID] = false;
          }
        });

        // Các cart được chọn từ trước (chooseCartItems) sẽ luôn được chọn
        chooseCartItems.forEach((cart) => {
          updatedChecked[cart.cartItemID] = true;
        });

        return updatedChecked;
      });
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

  const selectedItems = useMemo(() => {
    return carts.filter((cart) => checkedItems[cart.cartItemID]);
  }, [carts, checkedItems]);

  const calculateTotal = (items) => {
    return items.reduce(
      (total, cart) => total + cart.quantity * cart.product.price,
      0
    );
  };

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
                  unit={cart.product.unit}
                  onDeleted={handleItemDeleted}
                  checked={checkedItems[cart.cartItemID] || false}
                  onCheck={(checked) =>
                    handleCheckItem(cart.cartItemID, checked)
                  }
                  onUpdate={onUpdateQuantity}
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
            if (
              calculateTotal(selectedItems) > selected.voucher.minOrderAmount
            ) {
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
              disabled={
                calculateTotal(selectedItems) < voucher.voucher.minOrderAmount
              }
            >
              {voucher.voucher.code} - Giảm {voucher.voucher.discountValue}₫ cho
              đơn từ {voucher.voucher.minOrderAmount}
              {calculateTotal(selectedItems) < voucher.voucher.minOrderAmount
                ? "(Không đủ mức tiền tối thiểu ✖)"
                : ""}
            </option>
          ))}
        </select>

        {/* Cart Total - truyền selectedItems */}
        <CartTotal
          carts={selectedItems}
          voucher={selectedVoucher}
        
        />
      </div>
    </div>
  );
}

export default Cart;
