import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateUserExtra } from "../../services/userService"; // bạn cần tạo hàm này
import styles from "../Register/Register.module.scss";
import classNames from "classnames";

const cx = classNames.bind(styles);

const CompleteGoogleProfile = () => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        phone: "",
        role: "",
        businessName: "",
        certification: "",
        address: "",
    });

    const roles = ["Supplier", "Customer", "Shipper"];

    const handleRoleSelect = (role) => {
        setFormData((prev) => ({ ...prev, role }));
        setRole(role);
        setStep(2);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e) => {

        e.preventDefault();
        const params = new URLSearchParams(location.search);
        const userIdFromUrl = params.get("userId");

        if (userIdFromUrl) {
            localStorage.setItem("user", userIdFromUrl);
        }

        const userId = localStorage.getItem("user");
        try {
            await updateUserExtra(userId, formData);
            alert("Hoàn tất hồ sơ thành công!");
            navigate("/profile");
        } catch (error) {
            alert("Lỗi khi cập nhật hồ sơ: " + (error.message || error));
            console.error(error);
        }
    };

    return (
        <div className="container mt-3" style={{ maxWidth: "500px" }}>
            {step === 1 && <h3 className="text-center">Chọn vai trò của bạn</h3>}

            {step === 1 && (
                <div className={cx(styles["form-role"])}>
                    {roles.map((r) => (
                        <div
                            key={r}
                            onClick={() => handleRoleSelect(r)}
                            className={styles["role-item"]}
                        >
                            <img src="/role.png" alt={r} width="100" />
                            <p>{r}</p>
                        </div>
                    ))}
                </div>
            )}

            {step === 2 && (
                <>
                    <h3 className="text-center">Hoàn tất hồ sơ ({role})</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Phone</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {role === "Supplier" && (
                            <>
                                <div className="mb-3">
                                    <label>Business Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Certification</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="certification"
                                        value={formData.certification}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {role === "Customer" && (
                            <div className="mb-3">
                                <label>Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <button type="submit" className="btn btn-success w-100">
                            Hoàn tất hồ sơ
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default CompleteGoogleProfile;
