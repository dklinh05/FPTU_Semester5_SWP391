import React, { useState, useEffect } from "react";
import ShippingMap from "../ShippingMap/ShippingMap";
import {toast} from "react-toastify";

function AddressPopup({ isOpen, onClose, shippingAddress, setShippingAddress }) {
  const [localAddress, setLocalAddress] = useState(shippingAddress);
  const [isInDaNang, setIsInDaNang] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalAddress(shippingAddress);
      setIsInDaNang(false);
    }
  }, [isOpen, shippingAddress]);

  const canSave =
    localAddress?.lat !== undefined &&
    localAddress?.lng !== undefined &&
    isInDaNang;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-xl w-full max-w-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-3">Chọn địa chỉ giao hàng</h2>

        <ShippingMap
          shippingAddress={localAddress}
          setShippingAddress={setLocalAddress}
          setIsInDaNang={setIsInDaNang}
        />

        <textarea
          className="form-control mt-3 w-full border rounded p-2"
          rows="3"
          required
          value={localAddress?.address || ""}
          onChange={(e) =>
            setLocalAddress((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
        ></textarea>

        {!canSave && (
          <p className="text-sm text-red-600 mt-2">
            ⚠️ Vui lòng chọn hoặc nhập địa chỉ hợp lệ trong Đà Nẵng.
          </p>
        )}

        <button
          className={`btn btn-primary mt-3 ${
            !canSave ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (canSave) {
              setShippingAddress(localAddress);
              onClose();
            } else {
              toast.error("Địa chỉ không hợp lệ hoặc không nằm trong Đà Nẵng.");
            }
          }}
          disabled={!canSave}
        >
          Lưu địa chỉ
        </button>
      </div>
    </div>
  );
}

export default AddressPopup;
