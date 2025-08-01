import React, { useEffect, useCallback, useState } from "react";
import debounce from "lodash/debounce";
import { useCart } from "../../../context/CartContext";
import {
  deleteCartItem,
  updateQuantityCart,
} from "../../../services/cartItemService";
import PopupModal from "../../../components/PopupModal";
import styles from './CartItem.module.scss';

function CartItem({
                    quantity,
                    img,
                    name,
                    price,
                    id,
                    unit,
                    onDeleted,
                    checked,
                    onCheck,
                    stockQuantity,
                  }) {
  const { setReload } = useCart();
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});
  const isOutOfStock = stockQuantity === 0;

  const handleDeleteCartItem = async () => {
    try {
      const response = await deleteCartItem(id);
      setReload((prev) => !prev);
      console.log("Deleted:", response);
      onDeleted();
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm:", error);
    }
  };

  const debouncedUpdateQuantity = useCallback(
      debounce((id, newQuantity) => {
        updateQuantityCart({ cartItemId: id, quantity: newQuantity })
            .then((res) => {
              setReload((prev) => !prev);
              console.log("Debounced Update:", res);
              onDeleted();
            })
            .catch((err) => {
              console.error("Debounced error:", err);
            });
      }, 500),
      [id]
  );

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setLocalQuantity(value);
      setReload((prev) => !prev);
      debouncedUpdateQuantity(id, value);
    }
  };

  const handleChangeQuantity = (newQuantity) => {
    if (newQuantity < 1) {
      setPopupConfig({
        title: "Xác nhận xóa giỏ hàng",
        body: "Bạn có chắc muốn xóa sản phẩm này?",
        confirmText: "Ok",
        cancelText: "Cancel",
        onClose: () => {
          setLocalQuantity(1);
          setShowPopup(false);
        },
        onConfirm: () => {
          setShowPopup(false);
          handleDeleteCartItem();
        },
      });
      setShowPopup(true);
    } else {
      setLocalQuantity(newQuantity);
      debouncedUpdateQuantity(id, newQuantity);
    }
  };

  const handleBlur = () => {
    debouncedUpdateQuantity.cancel();
    updateQuantityCart({ cartItemId: id, quantity: localQuantity })
        .then((res) => {
          console.log("Immediate Update on Blur:", res);
        })
        .catch((err) => {
          console.error("Blur error:", err);
        });
  };

  return (
      <>
        <tr className={isOutOfStock ? styles["out-of-stock-row"] : ""}>
          <td className="text-center align-middle">
            <input
                type="checkbox"
                checked={checked}
                disabled={isOutOfStock}
                onChange={(e) => onCheck(e.target.checked)}
                style={{ transform: "scale(1.3)" }}
            />
          </td>

          <th scope="row">
            <div className="d-flex align-items-center">
              <img
                  src={img || "img/vegetable-item-3.png"}
                  className="img-fluid me-5 rounded-circle"
                  style={{ width: "80px", height: "80px" }}
                  alt="Product"
              />
            </div>
          </th>

          <td>
            <p className="mb-0 mt-4">{name}</p>
            {isOutOfStock && <span className="badge bg-danger mt-1">Hết hàng</span>}
          </td>

          <td>
            <p className="mb-0 mt-4">
              {price} VND / {unit}
            </p>
          </td>

          <td>
            {isOutOfStock ? (
                <p className="text-muted mt-4">Không thể điều chỉnh</p>
            ) : (
                <div className="input-group quantity mt-4" style={{ width: "100px" }}>
                  <div className="input-group-btn">
                    <button
                        className="btn btn-sm btn-minus rounded-circle bg-light border"
                        onClick={() => handleChangeQuantity(localQuantity - 1)}
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
                        onClick={() => handleChangeQuantity(localQuantity + 1)}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
            )}
          </td>

          <td>
            <p className="mb-0 mt-4">{price * localQuantity} VND</p>
          </td>

          <td>
            <button
                className="btn btn-md rounded-circle bg-light border mt-4"
                onClick={() => {
                  setPopupConfig({
                    title: "Xác nhận xoá sản phẩm",
                    body: `Bạn có chắc chắn muốn xoá sản phẩm "${name}" khỏi giỏ hàng?`,
                    confirmText: "Xoá",
                    cancelText: "Huỷ",
                    onClose: () => setShowPopup(false),
                    onConfirm: () => {
                      setShowPopup(false);
                      handleDeleteCartItem();
                    },
                  });
                  setShowPopup(true);
                }}
            >
              <i className="fa fa-trash text-danger"></i>
            </button>
          </td>
        </tr>

        <PopupModal
            show={showPopup}
            onClose={popupConfig.onClose}
            onConfirm={popupConfig.onConfirm}
            title={popupConfig.title}
            body={popupConfig.body}
            confirmText={popupConfig.confirmText}
            cancelText={popupConfig.cancelText}
        />
      </>
  );
}

export default React.memo(CartItem);
