import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getUserById,
  updateUser,
  uploadAvatar,
} from "../../services/userService";
import AddressPopup from "../../components/AddressPopup";
import {toast} from "react-toastify";

const Profile = () => {
  const { user, userId, setUser } = useUser();
  const [editField, setEditField] = useState(null); // "username", "email"
  const [fieldValue, setFieldValue] = useState("");
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [dirtyFields, setDirtyFields] = useState({});
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("avatar", file); // Tên field phải khớp với backend

    try {
      const response = await uploadAvatar(userId, formData); // Gọi API
      const updatedUser = await getUserById(userId); // Lấy lại user mới nhất
      setUser(updatedUser); // Cập nhật context
      setAvatarTimestamp(Date.now()); // Làm mới hình ảnh
    } catch (err) {
      toast.error("Tải lên avatar thất bại");
    }
  };

  const handleEditField = (field, value) => {
    setEditField(field);
    setFieldValue(value);
  };

  const handleSaveField = async () => {
    if (!user || !editField) return;

    const payload = {};
    if (editField === "fullName") {
      payload.fullName = fieldValue;
    } else if (editField === "email") {
      payload.email = fieldValue;
    } else if (editField === "phone") {
      payload.phone = fieldValue;
    } else if (editField === "address") {
      payload.address = fieldValue;
    }

    try {
      const updatedUser = await updateUser(userId, payload);
      setUser(updatedUser);
      setEditField(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!user) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <p>Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  // Hàm xử lý onChange cho input
  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;

    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));

    setDirtyFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Gửi chỉ những field đã thay đổi
  const handleSave = async (e) => {
    e.preventDefault();
    if (Object.keys(dirtyFields).length === 0) {
      toast.success("Không có thông tin nào được thay đổi!");
      return;
    }
    try {
      await updateUser(user.userID, dirtyFields);
      toast.success("Cập nhật thành công!");
      setDirtyFields({});
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      toast.error("Cập nhật thất bại: " + error.message); // <-- đây là nơi sinh ra lỗi
    } finally {
      setDirtyFields({});
    }
  };

  const avatarUrl = user.avatar
    ? `${user.avatar}?t=${avatarTimestamp}`
    : "/vite.svg";

  return (
    <div className="tab-content">
      {/* Tab Account - Active */}
      <div className="tab-pane fade show active" id="account" role="tabpanel">
        {/* Public Info Card */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Public info</h5>
            <div className="card-actions">
              <div className="dropdown">
                <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-more-horizontal align-middle"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label
                      htmlFor="inputUsername"
                      className="form-label text-dark"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputUsername"
                      value={user?.username || ""}
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="rounded-circle"
                    width={128}
                    height={128}
                    style={{ cursor: "pointer", objectFit: "cover" }}
                    onClick={handleAvatarClick}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <p className="text-muted mt-2">
                    <div className="mt-2">
                      <span className="btn btn-primary">
                        <i className="fa fa-upload"></i>
                      </span>
                    </div>
                    For best results, use an image at least 128px by 128px in
                    .jpg format
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Private Info Card */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Private info</h5>
            <div className="card-actions">
              <div className="dropdown">
                <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-more-horizontal align-middle"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label htmlFor="inputFullName" className="form-label text-dark">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputFullName"
                  value={user.fullName}
                  onChange={handleChange("fullName")}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="inputEmail" className="form-label text-dark">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail"
                  value={user.email}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="inputPhone" className="form-label text-dark">
                  Phone
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="inputPhone"
                  value={user.phone}
                  onChange={handleChange("phone")}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="inputRole" className="form-label text-dark">
                  Role
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputRole"
                  value={user.role || "null"}
                  readOnly
                  disabled
                />
              </div>
              {!showAddressForm && (
                <div className="mb-3">
                  <label
                    htmlFor="inputAddress"
                    className="form-label text-dark"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddress"
                    value={user.address}
                    onChange={handleChange("address")}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary mt-2"
                    onClick={() => setShowAddressForm(true)}
                  >
                    Thay đổi địa chỉ
                  </button>
                </div>
              )}
              <AddressPopup
                isOpen={showAddressForm}
                onClose={() => setShowAddressForm(false)}
                shippingAddress={{
                  address: user.address,
                  lat: user.lat,
                  lng: user.lng,
                }}
                setShippingAddress={({ address, lat, lng }) => {
                  setUser((prev) => ({
                    ...prev,
                    address,
                    lat,
                    lng,
                  }));
                  setDirtyFields((prev) => ({
                    ...prev,
                    address,
                    lat,
                    lng,
                  }));
                }}
              />
              <div className="mb-3">
                <label
                  htmlFor="inputRewardPoints"
                  className="form-label text-dark"
                >
                  Reward Points
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="inputRewardPoints"
                  value={user.rewardPoints}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="inputTotalSpend"
                  className="form-label text-dark"
                >
                  Total Spend (VND)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="inputTotalSpend"
                  value={user.totalSpend}
                  readOnly
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
