import { useEffect, useCallback, useState } from "react";
import debounce from "lodash/debounce";
import { useCart } from "../../../context/CartContext"; 
import { deleteCartItem, updateQuantityCart} from "../../../services/cartItemService";

function CartItem({
  quantity,
  img,
  name,
  price,
  id,
  onDeleted,
  checked,
  onCheck,
}) {
  const { setReload } = useCart();
  const [localQuantity, setLocalQuantity] = useState(quantity);

  const handleDeleteCartItem = async () => {
    try {
      const response = await deleteCartItem(id);
      setReload(prev => !prev);
      console.log("Response:", response);
      onDeleted();
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const handleUpdateQuantity = async (newQuantity) => {
    setLocalQuantity(newQuantity);
    try {
      const response = await updateQuantityCart({
        cartItemId: id,
        quantity: newQuantity,
      });
      setReload(prev => !prev);
      console.log("Response:", response);
      onDeleted();
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  // Debounced API call
  const debouncedUpdateQuantity = useCallback(
    debounce((id, newQuantity) => {
      updateQuantityCart({ cartItemId: id, quantity: newQuantity })
        .then((res) => {
          console.log("Debounced Update:", res);
          onDeleted();
        })
        .catch((err) => {
          console.error("Debounced error:", err);
        });
    }, 500),
    [id]
  );

  // Gọi khi user nhập số lượng
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setLocalQuantity(value);
      debouncedUpdateQuantity(id, value);
    }
  };

  // Gọi khi user blur ra ngoài, để đảm bảo dữ liệu được lưu lại
  const handleBlur = () => {
    debouncedUpdateQuantity.cancel(); // huỷ debounce nếu chưa gọi
    updateQuantityCart({ cartItemId: id, quantity: localQuantity })
      .then((res) => {
        console.log("Immediate Update on Blur:", res);
      })
      .catch((err) => {
        console.error("Blur error:", err);
      });
  };

  return (
    <tr>
      <td className="text-center align-middle">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
            style={{ transform: "scale(1.3)" }}
        />
      </td>

      <th scope="row">
        <div className="d-flex align-items-center">
          <img
            src={img ? img : "img/vegetable-item-3.png"}
            className="img-fluid me-5 rounded-circle"
            style={{ width: "80px", height: "80px" }}
            alt="Big Banana"
          />
        </div>
      </th>
      <td>
        <p className="mb-0 mt-4">{name}</p>
      </td>
      <td>
        <p className="mb-0 mt-4">{price} $</p>
      </td>
      <td>
        <div className="input-group quantity mt-4" style={{ width: "100px" }}>
          <div className="input-group-btn">
            <button
              className="btn btn-sm btn-minus rounded-circle bg-light border"
              onClick={() => handleUpdateQuantity(quantity - 1)}
            >
              <i className="fa fa-minus"></i>
            </button>
          </div>
          <input
            type="text"
            className="form-control form-control-sm text-center border-0"
            value={localQuantity}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="input-group-btn">
            <button
              className="btn btn-sm btn-plus rounded-circle bg-light border"
              onClick={() => handleUpdateQuantity(quantity + 1)}
            >
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
      </td>
      <td>
        <p className="mb-0 mt-4">{price * localQuantity} $</p>
      </td>
      <td>
        <button
          className="btn btn-md rounded-circle bg-light border mt-4"
          onClick={handleDeleteCartItem}
        >
          <i className="fa fa-times text-danger"></i>
        </button>
      </td>
    </tr>
  );
}

export default CartItem;
