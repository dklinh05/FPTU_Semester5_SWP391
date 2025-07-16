import React, { useEffect, useState } from "react";
import styles from "./CommunityChatBanner.module.scss";
import { useLocation } from "../../../context/LocationContext";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CommunityChatBanner = () => {
  const { currentLocation } = useLocation(); // Lấy vị trí hiện tại
  const { user } = useUser();
  const [userID, setUserId] = useState(null);
  const navigate = useNavigate();

  // Đồng bộ userID từ context
  useEffect(() => {
    if (user && user.userID) {
      setUserId(user.userID);
    }
  }, [user]);

  // Hàm lấy thông tin người dùng từ database để lấy lat/lng
  const fetchUserInfoFromDatabase = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/farmtrade/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data;
      if (userData.lat && userData.lng) {
        return {
          lat: userData.lat,
          lng: userData.lng,
        };
      }
      return null;
    } catch (error) {
      console.error("Không thể lấy thông tin người dùng từ database:", error);
      return null;
    }
  };

  const handleJoinClick = async () => {
    let lat, lng;

    // Bước 1: Lấy từ LocationContext (vị trí hiện tại)
    if (currentLocation?.lat && currentLocation?.lng) {
      lat = currentLocation.lat;
      lng = currentLocation.lng;
    }
    console.log(lat, lng);
    // Bước 2: Nếu chưa có tọa độ, lấy từ database
    if (!lat || !lng) {
      if (!userID) {
        alert("Bạn cần đăng nhập để tham gia nhóm chat.");
        return;
      }

      const dbLocation = await fetchUserInfoFromDatabase(userID);
      if (dbLocation) {
        lat = dbLocation.lat;
        lng = dbLocation.lng;
      }
    }

    // Bước 3: Kiểm tra xem đã có tọa độ chưa
    if (!lat || !lng) {
      alert(
        "Không tìm thấy tọa độ trong hệ thống. Vui lòng cập nhật vị trí của bạn."
      );
      return;
    }

    // Gửi dữ liệu lên server
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/farmtrade/conversations/join-community",
        {
          latitude: lat,
          longitude: lng,
          userId: userID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const conversationId = response.data.conversationId;

      if (conversationId) {
        alert(response.data.message || "Tham gia nhóm thành công!");
        navigate(`/chat/${conversationId}`);
      } else {
        alert("Không tìm thấy ID cuộc hội thoại.");
      }
    } catch (error) {
      console.error("Lỗi khi tham gia nhóm chat:", error);
      alert(error.response?.data?.message || "Không thể tham gia nhóm chat.");
    }
  };

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <h3>Tham gia nhóm chat cộng đồng gần khu vực của bạn</h3>
        <button className={styles.joinButton} onClick={handleJoinClick}>
          Tham gia ngay
        </button>
      </div>
    </div>
  );
};

export default CommunityChatBanner;
