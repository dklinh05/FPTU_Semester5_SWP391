import React, { useState, useEffect } from "react";
import ShippingMap from "../ShippingMap/ShippingMap";

function AddressPopup({ isOpen, onClose, shippingAddress, setShippingAddress }) {
  const [localAddress, setLocalAddress] = useState(shippingAddress);

  useEffect(() => {
    if (isOpen) {
      setLocalAddress(shippingAddress);
    }
  }, [isOpen, shippingAddress]);

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
        />

        <textarea
          className="form-control mt-3 w-full border rounded p-2"
          rows="3"
          required
          value={localAddress.address}
          onChange={(e) =>
            setLocalAddress((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
        ></textarea>

        <button
          className="btn btn-primary mt-3"
          onClick={() => {
            setShippingAddress(localAddress);
            onClose();
          }}
        >
          Lưu địa chỉ
        </button>
      </div>
    </div>
  );
}

export default AddressPopup;
