import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// Fix icon marker mặc định không hiển thị
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Khi người dùng click bản đồ
function LocationPicker({ setMarker, setShippingAddress }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarker({ lat, lng });

      // Reverse geocoding để lấy địa chỉ từ tọa độ
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          const address = data.display_name;
          setShippingAddress({ address, lat, lng }); // ✅ Gửi cả 3
        })
        .catch((err) => {
          console.error("Lỗi reverse geocoding:", err);
        });
    },
  });
  return null;
}

// Tự động di chuyển bản đồ đến marker
function MoveMapToMarker({ marker }) {
  const map = useMap();
  useEffect(() => {
    if (marker) {
      map.setView(marker, 16);
    }
  }, [marker]);
  return null;
}

export default function ShippingMap({ shippingAddress, setShippingAddress }) {
  const [marker, setMarker] = useState(null);

  // Khi người dùng nhập địa chỉ thủ công
  useEffect(() => {
    const addressText =
      typeof shippingAddress === "string"
        ? shippingAddress
        : shippingAddress?.address;

    if (addressText && addressText.length > 5) {
      const encoded = encodeURIComponent(addressText);

      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&viewbox=107.96,16.16,108.31,15.91&bounded=1`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            const alreadySame =
              shippingAddress?.lat === lat && shippingAddress?.lng === lon;

            if (!alreadySame) {
              setMarker({ lat, lng: lon });
              setShippingAddress({
                address: addressText,
                lat,
                lng: lon,
              });
            }
          }
        })
        .catch((err) => {
          console.error("Lỗi forward geocoding:", err);
        });
    }
  }, [shippingAddress?.address]); // ✅ chỉ lắng nghe khi address thay đổi

  const centerDaNang = [16.0471, 108.2068];

  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Chọn địa chỉ trên bản đồ</label>
      <MapContainer
        center={centerDaNang}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationPicker
          setMarker={setMarker}
          setShippingAddress={setShippingAddress}
        />
        {marker && (
          <>
            <Marker position={marker} />
            <MoveMapToMarker marker={marker} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
