import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const districtData = {
  "Hải Châu": ["Thạch Thang", "Hải Châu 1", "Hải Châu 2", "Bình Hiên", "Bình Thuận"],
  "Thanh Khê": ["Tân Chính", "Vĩnh Trung", "Thanh Khê Đông", "Thanh Khê Tây"],
  "Sơn Trà": ["An Hải Bắc", "An Hải Tây", "Phước Mỹ"],
  "Ngũ Hành Sơn": ["Hòa Hải", "Khuê Mỹ", "Mỹ An"],
  "Liên Chiểu": ["Hòa Khánh Bắc", "Hòa Khánh Nam", "Hòa Minh"],
  "Cẩm Lệ": ["Hòa An", "Hòa Phát", "Hòa Thọ Đông", "Hòa Thọ Tây"],
};

function LocationPicker({ setMarker, setShippingAddress }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarker({ lat, lng });

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          setShippingAddress(data.display_name);
        });
    },
  });
  return null;
}

function MoveMapToMarker({ marker }) {
  const map = useMap();
  useEffect(() => {
    if (marker) {
      map.setView(marker, 16);
    }
  }, [marker]);
  return null;
}

export default function AddressForm({ shippingAddress, setShippingAddress }) {
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [marker, setMarker] = useState(null);

  const centerDaNang = [16.0471, 108.2068];

  // Ghép địa chỉ khi người dùng chọn
  useEffect(() => {
    if (district && ward && street) {
      const full = `${street}, ${ward}, ${district}, Đà Nẵng`;
      setShippingAddress(full);
    }
  }, [district, ward, street]);

  // Khi shippingAddress thay đổi thủ công => update marker
  useEffect(() => {
    if (shippingAddress && shippingAddress.length > 5) {
      const encoded = encodeURIComponent(shippingAddress);
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&viewbox=107.96,16.16,108.31,15.91&bounded=1`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setMarker({ lat, lng: lon });
          }
        });
    }
  }, [shippingAddress]);

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">Địa chỉ giao hàng</label>

      {/* Form chọn hành chính */}
      <div className="mb-2">
        <select
          className="form-select mb-2"
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setWard("");
          }}
        >
          <option value="">Chọn quận</option>
          {Object.keys(districtData).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          className="form-select mb-2"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          disabled={!district}
        >
          <option value="">Chọn phường</option>
          {district &&
            districtData[district].map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
        </select>

        <input
          type="text"
          className="form-control"
          placeholder="Số nhà, tên đường..."
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
      </div>

      {/* Bản đồ */}
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
