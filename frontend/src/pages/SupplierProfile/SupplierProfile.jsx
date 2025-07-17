import React, { useState, useRef } from "react";
import { useUser } from "../../context/UserContext";
import {
    getUserById,
    updateUser,
    uploadAvatar,
} from "../../services/userService";
import AddressPopup from "../../components/AddressPopup";
import CertificationPreview from "../../components/PopupModal/CertificationPreview";

const ProfileSupplier = () => {
    const { user, userId, setUser } = useUser();
    const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
    const [dirtyFields, setDirtyFields] = useState({});
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showCertPreview, setShowCertPreview] = useState(false);
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            await uploadAvatar(userId, formData);
            const updatedUser = await getUserById(userId);
            setUser(updatedUser);
            setAvatarTimestamp(Date.now());
        } catch (err) {
            console.error("Lỗi upload avatar:", err);
            alert("Upload avatar thất bại");
        }
    };

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setUser((prev) => ({ ...prev, [field]: value }));
        setDirtyFields((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (Object.keys(dirtyFields).length === 0) {
            alert("Không có thay đổi nào!");
            return;
        }
        try {
            await updateUser(userId, dirtyFields);
            alert("Cập nhật thành công!");
            setDirtyFields({});
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            alert("Cập nhật thất bại: " + error.message);
        }
    };

    const avatarUrl = user.avatar
        ? `${user.avatar}?t=${avatarTimestamp}`
        : "/vite.svg";

    if (!user) {
        return <p>Đang tải thông tin...</p>;
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h5>Supplier Profile</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSave}>
                        {/* Avatar */}
                        <div className="text-center mb-4">
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="rounded-circle"
                                width={128}
                                height={128}
                                style={{ objectFit: "cover", cursor: "pointer" }}
                                onClick={handleAvatarClick}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            <p className="mt-2 text-muted">Nhấn vào ảnh để thay đổi</p>
                        </div>

                        {/* Business Name */}
                        <div className="mb-3">
                            <label className="form-label">Business Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user.businessName || ""}
                                onChange={handleChange("businessName")}
                            />
                        </div>

                        {/* Phone (read-only) */}
                        <div className="mb-3">
                            <label className="form-label">Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user.phone || ""}
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Certification</label>
                            {user.certification ? (
                                <>
                                    <div
                                        onClick={() => setShowCertPreview(true)}
                                        style={{
                                            maxWidth: "240px",
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            transition: "transform 0.2s",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        <img
                                            src={user.certification}
                                            alt="Certification"
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                                display: "block",
                                            }}
                                        />
                                    </div>

                                    <CertificationPreview
                                        imageUrl={user.certification}
                                        onClose={() => setShowCertPreview(false)}
                                        isOpen={showCertPreview}
                                    />
                                </>
                            ) : (
                                <p className="text-muted">Chưa có chứng nhận</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user.address || ""}
                                onChange={handleChange("address")}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm mt-2"
                                onClick={() => setShowAddressForm(true)}
                            >
                                Chọn địa chỉ trên bản đồ
                            </button>
                        </div>

                        <AddressPopup
                            isOpen={showAddressForm}
                            onClose={() => setShowAddressForm(false)}
                            shippingAddress={{
                                address: user.address,
                                lat: user.lat,
                                lng: user.lng,
                            }}
                            setShippingAddress={({ address, lat, lng }) => {
                                setUser((prev) => ({ ...prev, address, lat, lng }));
                                setDirtyFields((prev) => ({
                                    ...prev,
                                    address,
                                    lat,
                                    lng,
                                }));
                            }}
                        />

                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSupplier;
