import { useState } from "react";
import { districtCoordinates } from "../../data/DistrictData";

function LocationDropdown({
  setSelectedDistrict,
  setCurrentPage,
  currentLocation,
  setSelectedLocation,
  currentDistrict,
}) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);

    const parsed = JSON.parse(value);
    setSelectedDistrict(parsed.district);
    setSelectedLocation(parsed.location);

    setCurrentPage(1);
  };

  return (
    <div className="col-lg-3">
      <select
        className="form-select"
        value={selectedValue}
        onChange={handleChange}
      >
        <option
          value={JSON.stringify({
            district: currentDistrict,
            location: currentLocation,
          })}
        >
          {currentDistrict}
        </option>

        {Object.entries(districtCoordinates).map(([district, coords]) => (
          <option
            key={district}
            value={JSON.stringify({ district, location: coords })}
          >
            {district}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LocationDropdown;
