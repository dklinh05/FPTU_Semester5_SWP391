import React, { useState } from "react";
import ShippingMap from "../ShippingMap/ShippingMap";
function AddressPopup({
  isOpen,
  onClose,
  shippingAddress,
  setShippingAddress,
}) {
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
          shippingAddress={shippingAddress}
          setShippingAddress={setShippingAddress}
        />

        <textarea
          className="form-control mt-3 w-full border rounded p-2"
          rows="3"
          required
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}

export default AddressPopup;
