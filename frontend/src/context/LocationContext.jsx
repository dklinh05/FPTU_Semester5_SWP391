import { createContext, useContext, useEffect, useState } from "react";
import { getAddressFromCoords } from "../services/mapService";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentDistrict, setCurrentDistrict] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLocation({ lat, lng });
        setSelectedLocation({ lat, lng })

        try {
          const address = await getAddressFromCoords(lat, lng);
          const district =
            address?.suburb ||
            address?.city_district ||
            address?.town ||
            address?.county;
          setCurrentDistrict(`📍 ${district || "Vị trí hiện tại"}`);
          setSelectedDistrict(`📍 ${district || "Vị trí hiện tại"}`);
        } catch (err) {
          console.error("Lỗi lấy địa chỉ:", err);
        }
      },
      (error) => {
        console.error("Không lấy được vị trí:", error);
      }
    );
  }, []);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        selectedDistrict,
        setSelectedDistrict,
        selectedLocation,
        setSelectedLocation,
        currentDistrict,
        setCurrentDistrict,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  return useContext(LocationContext);
};
