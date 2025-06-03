import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getUserById,
  updateUser,
  uploadAvatar,
} from "../../services/userService";

const Profile = () => {

  //  const { user } = useUser();
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null); // "username", "email"
  const [fieldValue, setFieldValue] = useState("");
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [dirtyFields, setDirtyFields] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userIdFromUrl = params.get("userId");

    if (userIdFromUrl) {
      localStorage.setItem("user", userIdFromUrl);
    }

    const userId = localStorage.getItem("user");

    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data);
        setAvatarTimestamp(Date.now());
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      }
    };

    if (userId) fetchUser();
  }, [location.search]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("avatar", file); // Tên field phải khớp với backend

    try {
      const updatedUser = await uploadAvatar(user.userID, formData);
      setUser(updatedUser);
      setAvatarTimestamp(Date.now());
    } catch (err) {
      console.error("Lỗi upload avatar:", err);
      alert("Upload avatar thất bại");
    }
  };

  const handleEditField = (field, value) => {
    setEditField(field);
    setFieldValue(value);
  };

  // const handleSaveField = async () => {
  //   if (!user || !editField) return;

  //   const payload = {};
  //   if (editField === "username") {
  //     payload.username = fieldValue;
  //   } else if (editField === "email") {
  //     payload.email = fieldValue;
  //   }

  //   try {
  //     const updatedUser = await updateUser(user.userID, payload);
  //     setUser(updatedUser);
  //     setEditField(null);
  //   } catch (err) {
  //     console.error("Lỗi cập nhật thông tin:", err.message);
  //     alert(err.message);
  //   }
  // };

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
      const updatedUser = await updateUser(user.userID, payload);
      setUser(updatedUser);
      setEditField(null);
    } catch (err) {
      console.error("Lỗi cập nhật thông tin:", err.message);
      alert(err.message);
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
    const value = e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;

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
    alert("Không có thông tin nào được thay đổi!");
    return;
  }

  try {
    await updateUser(user.userID, dirtyFields);
    alert("Cập nhật thành công!");
    setDirtyFields({});
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
    alert("Cập nhật thất bại: " + error.message);
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-more-horizontal align-middle">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <a className="dropdown-item" href="#">Action</a>
                  <a className="dropdown-item" href="#">Another action</a>
                  <a className="dropdown-item" href="#">Something else here</a>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="inputUsername" className="form-label">Username</label>
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
                    For best results, use an image at least 128px by 128px in .jpg format
                  </p>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3">Save changes</button>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-more-horizontal align-middle">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <a className="dropdown-item" href="#">Action</a>
                  <a className="dropdown-item" href="#">Another action</a>
                  <a className="dropdown-item" href="#">Something else here</a>
                </div>
              </div>
            </div>
          </div>
     <div className="card-body">
                    <form onSubmit={handleSave}>
                      <div className="mb-3">
                        <label htmlFor="inputFullName" className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputFullName"
                          value={user.fullName}
                          onChange={handleChange("fullName")}
                        />
                      </div>

              <div className="mb-3">
                <label htmlFor="inputEmail" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail"
                  value={user.email}
                  readOnly
                />
              </div>
           <div className="mb-3">
        <label htmlFor="inputPhone" className="form-label">Phone</label>
        <input
          type="tel"
          className="form-control"
          id="inputPhone"
          value={user.phone}
          onChange={handleChange("phone")}
        />
      </div>

              <div className="mb-3">
                <label htmlFor="inputRole" className="form-label">Role</label>
                <input type="text" className="form-control" id="inputRole" value={user.role || "null"} readOnly disabled />
              </div>
      <div className="mb-3">
        <label htmlFor="inputAddress" className="form-label">Address</label>
        <input
          type="text"
          className="form-control"
          id="inputAddress"
          value={user.address}
          onChange={handleChange("address")}
        />
      </div>

              <div className="mb-3">
                <label htmlFor="inputRewardPoints" className="form-label">Reward Points</label>
                <input
                  type="number"
                  className="form-control"
                  id="inputRewardPoints"
                  value={user.rewardPoints}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="inputTotalSpend" className="form-label">Total Spend (VND)</label>
                <input
                  type="number"
                  className="form-control"
                  id="inputTotalSpend"
                  value={user.totalSpend}
                  readOnly
                />
              </div>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </form>
          </div>
        </div>
      </div>

      {/* Tab Password */}
      <div className="tab-pane fade" id="password" role="tabpanel">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Password</h5>
            <form>
              <div className="mb-3">
                <label htmlFor="inputPasswordCurrent" className="form-label">Current password</label>
                <input type="password" className="form-control" id="inputPasswordCurrent" />
                <small><a href="#">Forgot your password?</a></small>
              </div>
              <div className="mb-3">
                <label htmlFor="inputPasswordNew" className="form-label">New password</label>
                <input type="password" className="form-control" id="inputPasswordNew" />
              </div>
              <div className="mb-3">
                <label htmlFor="inputPasswordNew2" className="form-label">Verify password</label>
                <input type="password" className="form-control" id="inputPasswordNew2" />
              </div>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
