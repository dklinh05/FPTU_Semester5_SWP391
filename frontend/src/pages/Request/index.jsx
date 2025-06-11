import React, { useEffect, useState } from "react";
import axios from "axios";

function Request() {
  const [formData, setFormData] = useState({
    businessName: "",
    city: "Da Nang",
    district: "",
    ward: "",
    street: "",
  });

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const districtToWards = {
    "Ngu Hanh Son": ["Hoa Hai", "Hoa Quy","Khue My", "My An"],
    "Cam Le": ["Hoa An", "Hoa Phat","Hoa Tho Dong","Hoa Tho Tay","Hoa Xuan","Khue Trung"],
    "Hai Chau": ["Binh Hien", "Binh Thuan","Hai Chau 1","Hai Chau 2","Hoa Cuong Bac","Hoa Cuong Nam","Hoa Thuan Tay","Nam Duong","Phuoc Ninh","Thach Trang","Thanh Binh","Thuan Phuoc"],
    "Thanh Khe": ["An Khe", "Chinh Gian","Hoa Khe","Tam Thuan","Tan Chinh","Thac Gian","Thanh Khe Dong","Thanh Khe Tay","Vinh Trung","Xuan Ha"],
    "Son Tra": ["An Hai Bac", "An Hai Dong","An Hai Tay","Man Thai","Nai Hien Dong","Phuoc My","Tho Quang"],
    "Lien Chieu": ["Hoa Hiep Bac","Hoa Hiep Nam","Hoa Khanh Bac","Hoa Khanh Nam","Hoa Minh"],
    "Hoa Vang":["Hoa Bac","Hoa Chau","Hoa Khuong","Hoa Lien","Hoa Nhon","Hoa Ninh","Hoa Phong","Hoa Phu","Hoa Phuoc","Hoa Son","Hoa Tien"]
  };
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`/users/${userId}`);
        setUserData(res.data);
        setLoading(false);
      } catch (error) {
        setError(" Cannot find user data!!");
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict,
      ward: "",
    }));

    if (districtToWards[selectedDistrict]) {
      setWards(districtToWards[selectedDistrict]);
    } else {
      setWards([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullAddress = `${formData.street}, ${formData.ward}, ${formData.district}, ${formData.city}`;

    // Tạo FormData để gửi file và dữ liệu
    const formDataToSend = new FormData();
    formDataToSend.append("userId", userData.id);
    formDataToSend.append("requestedRole", "SUPPLIER");
    formDataToSend.append("businessName", formData.businessName);
    formDataToSend.append("certification", certificationFile);
    formDataToSend.append("address", fullAddress);

    try {
      await axios.post("/users/request", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Upgrade request was sent successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send request!");
    }
  };

  if (loading) return <div>Data Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
      <>
    <div className="container py-5">
      <h2 className="mb-4">Register to become a supplier</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="businessName" className="form-label">
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            className="form-control"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address fields */}
        <div className="mb-3">
          <label className="form-label">Address to pick order</label>
          <div className="row g-2">
            {/* City */}
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                value={formData.city}
                readOnly
              />
            </div>

            <div className="col-auto">
              <select
                name="district"
                className="form-select"
                value={formData.district}
                onChange={handleDistrictChange}
                required
              >
                <option value="">District</option>
                {Object.keys(districtToWards).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                ))}
              </select>
            </div>

            <div className="col-auto">
              <select
                name="ward"
                className="form-select"
                value={formData.ward}
                onChange={handleChange}
                required
              >
                <option value="">Ward</option>
                {wards.map((ward) => (
                    <option key={ward} value={ward}>
                      {ward}
                    </option>
                ))}
              </select>
            </div>

            <div className="col-12 mt-2">
              <input
                type="text"
                name="street"
                className="form-control"
                placeholder="House Number"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="certification" className="form-label">
            Certification
          </label>
          <input
            type="file"
            id="certification"
            name="certification"
            className="form-control"
            value={formData.certification}
            onChange={(e) => setCertificationFile(e.target.files[0])}
            required
          />
        </div>

        {/*khong lay duoc data, tam thoi chua biet fix TT */}
        {/*<div className="mb-3">*/}
        {/*  <label htmlFor="inputEmail" className="form-label">*/}
        {/*    Email*/}
        {/*  </label>*/}
        {/*  <input*/}
        {/*      type="text"*/}
        {/*      id="inputEmail"*/}
        {/*      className="form-control"*/}
        {/*      value={userData?.email || ""}*/}
        {/*      readOnly*/}
        {/*  />*/}
        {/*</div>*/}

        {/*<div className="mb-3">*/}
        {/*  <label htmlFor="inputPhone" className="form-label">*/}
        {/*    Phone*/}
        {/*  </label>*/}
        {/*  <input*/}
        {/*      type="text"*/}
        {/*      id="inputPhone"*/}
        {/*      className="form-control"*/}
        {/*      value={userData?.phone || ""}*/}
        {/*      readOnly*/}
        {/*  />*/}
        {/*</div>*/}

        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
      </>
  );
}

export default Request;