import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserById } from "../../services/userService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Lấy userId từ URL nếu có
    const params = new URLSearchParams(location.search);
    const userIdFromUrl = params.get("userId");

    // Nếu có userId từ URL thì lưu vào localStorage
    if (userIdFromUrl) {
      localStorage.setItem("user", userIdFromUrl);
    }

    const userId = localStorage.getItem("user");

    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      }
    };

    if (userId) fetchUser();
  }, [location.search]);

  if (!user) {
    return <p>Đang tải thông tin người dùng...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Hồ sơ cá nhân</h2>
      <div className="card" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <div className="text-center">
            <img
              src={
                user.avatar
                  ?user.avatar.startsWith("/")
                    ? user.avatar
                    : `http://localhost:8080/farmtrade/avatars/${user.avatar}`
                  : "/vite.svg"
              }

              alt="Avatar"
              className="rounded-circle"
              width={120}
              height={120}
            />
          </div>
          <hr />
          <p>
            <strong>Họ tên:</strong> {user.fullName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {/* <p>
            <strong>Số điện thoại:</strong> {user.phone}
          </p> */}
          {/* <p>
            <strong>Vai trò:</strong> {user.role}
          </p> */}
          {/* {user.role === "Buyer" && (
            <>
              <p>
                <strong>Địa chỉ:</strong> {user.address}
              </p>
              <p>
                <strong>Điểm thưởng:</strong> {user.rewardPoints}
              </p>
              <p>
                <strong>Tổng chi tiêu:</strong> {user.totalSpend}đ
              </p>
            </>
          )}
          {user.role === "Supplier" && (
            <>
              <p>
                <strong>Tên doanh nghiệp:</strong> {user.businessName}
              </p>
              <p>
                <strong>Giấy chứng nhận:</strong> {user.certification}
              </p>
              <p>
                <strong>Doanh thu:</strong> {user.totalRevenue}đ
              </p>
            </>
          )}
          {user.role === "Shipper" && (
            <>
              <p>
                <strong>Phương tiện:</strong> {user.vehicle}
              </p>
              <p>
                <strong>Biển số xe:</strong> {user.licensePlate}
              </p>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
