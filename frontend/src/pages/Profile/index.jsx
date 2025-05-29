import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getUserById, updateUser, uploadAvatar } from "../../services/userService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null); // "username", "email"
  const [fieldValue, setFieldValue] = useState("");
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());

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

    const tempUrl = URL.createObjectURL(file);
    setUser((prevUser) => ({
      ...prevUser,
      avatarPreview: tempUrl,
    }));

    try {
      const updatedUser = await uploadAvatar(user.id, file);
      setUser(updatedUser);
      setAvatarTimestamp(Date.now());
    } catch (err) {
      console.error("Lỗi upload avatar:", err);
    }
  };

  const handleEditField = (field, value) => {
    setEditField(field);
    setFieldValue(value);
  };

  const handleSaveField = async () => {
    if (!user || !editField) return;

    const payload = {};
    payload[editField] = fieldValue;

    try {
      const updatedUser = await updateUser(user.id, payload);
      setUser(updatedUser);
      setEditField(null);
    } catch (err) {
      console.error("Lỗi cập nhật thông tin:", err);
    }
  };

  if (!user) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <p>Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  const avatarUrl = user.avatar
    ? `${user.avatar}?t=${avatarTimestamp}`
    : "/vite.svg";

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
<div className="card w-100" style={{ maxWidth: "100%" }}>
        <div className="card-body p-4">
          <h4 className="mb-3 text-center">My Profile</h4>
          <hr className="mb-4" />

          <div className="d-flex align-items-center justify-content-between mb-4">
            {/* Phần thông tin người dùng - bên trái */}
            <div className="flex-grow-1">
              {/* Username */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Username:</strong>
                {editField === "username" ? (
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                      className="form-control me-2"
                      style={{ maxWidth: "200px" }}
                    />
                    <button
                      className="btn btn-success btn-sm me-1"
                      onClick={handleSaveField}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditField(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span>
                    {user.username}{" "}
                    <button
                      className="btn btn-outline-primary btn-sm ms-2"
                      onClick={() =>
                        handleEditField("username", user.username)
                      }
                    >
                      Change
                    </button>
                  </span>
                )}
              </div>

              {/* Full Name - chỉ hiển thị */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Full name:</strong>
                <span>{user.fullName}</span>
              </div>

              {/* Email */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Email:</strong>
                {editField === "email" ? (
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                      className="form-control me-2"
                      style={{ maxWidth: "200px" }}
                    />
                    <button
                      className="btn btn-success btn-sm me-1"
                      onClick={handleSaveField}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditField(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span>
                    {user.email}{" "}
                    <button
                      className="btn btn-outline-primary btn-sm ms-2"
                      onClick={() => handleEditField("email", user.email)}
                    >
                      Change
                    </button>
                  </span>
                )}
              </div>

              {/* Phone - chỉ hiển thị */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Phone:</strong>
                <span>{user.phone}</span>
              </div>
            </div>

            {/* Avatar - bên phải */}
            <div className="text-center">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="rounded-circle"
                width={120}
                height={120}
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
              <p className="text-muted mt-2">Nhấn vào ảnh để thay đổi avatar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
