import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserById } from "../../services/userService";
import styles from './Profile.module.scss';
import { Search, ShoppingCart } from "lucide-react";

const Header = ({ username }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Search: ${searchTerm}`);
  };

  return (
      <header className={`container-fluid px-0 ${styles.header}`}>
        <div className="row align-items-center py-3 mx-0">
          <div className="col-2 d-flex justify-content-start">
            <div className={styles.logo}>
              <img src="/public/logo.png" alt="Logo" />
            </div>
          </div>

          <div className="col-8 d-flex align-items-center">
            <form onSubmit={handleSearchSubmit} className="w-100">
              <div className="input-group">
          <span className={`input-group-text bg-white text-dark ${styles.inputGroupText}`}>
            <Search size={20} />
          </span>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={`form-control ${styles.searchInput}`}
                    //placeholder="Tìm kiếm..."
                />
              </div>
            </form>
          </div>

          <div className="col-1 d-flex flex-column align-items-end">
            <div className={styles.username}>
              <div>{username || "account_name"}</div>
            </div>
            <div className={styles.cartIcon}>
              <ShoppingCart size={28} />
            </div>
          </div>
        </div>
      </header>
  );
};


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
    return (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Đang tải thông tin người dùng...</p>
        </div>
    );
  }

  return (
      <div>
        <Header username={user.username} />
        <div >
          <h2>Hồ sơ cá nhân</h2>
          <div className="card-body" >
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

            <p><strong>Họ tên:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
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
