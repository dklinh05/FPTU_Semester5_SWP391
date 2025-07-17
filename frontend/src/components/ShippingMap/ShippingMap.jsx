import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {toast} from "react-toastify";

// Fix icon mặc định
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationPicker({ setMarker, setShippingAddress, setIsInDaNang }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          const address = data.display_name;
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.state;

          if (city?.toLowerCase().includes("đà nẵng")) {
            setMarker({ lat, lng });
            setShippingAddress({ address, lat, lng });
            setIsInDaNang(true);
          } else {
            toast.error("Vị trí không thuộc thành phố Đà Nẵng.");
            setIsInDaNang(false);
          }
        })
        .catch((err) => {
          console.error("Lỗi reverse geocoding:", err);
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

export default function ShippingMap({
  shippingAddress,
  setShippingAddress,
  setIsInDaNang,
}) {
  const [marker, setMarker] = useState(null);

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

            fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
            )
              .then((res) => res.json())
              .then((reverseData) => {
                const city =
                  reverseData?.address?.city ||
                  reverseData?.address?.town ||
                  reverseData?.address?.state;

                if (city?.toLowerCase().includes("đà nẵng")) {
                  setMarker({ lat, lng: lon });
                  setShippingAddress({
                    address: addressText,
                    lat,
                    lng: lon,
                  });
                  setIsInDaNang(true);
                } else {
                  setIsInDaNang(false);
                }
              });
          } else {
            setIsInDaNang(false);
          }
        })
        .catch(() => setIsInDaNang(false));
    }
  }, [shippingAddress?.address]);

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
          setIsInDaNang={setIsInDaNang}
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
