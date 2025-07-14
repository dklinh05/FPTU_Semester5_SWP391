import React, { useEffect, useState } from "react";
import styles from "./CommunityChatBanner.module.scss";
import { useLocation } from "../../../context/LocationContext";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const CommunityChatBanner = () => {
  const { currentLocation } = useLocation(); // { lat, lng }
  const { user } = useUser(); 
  const [userID, setUserId] = useState(null);
    const navigate = useNavigate(); 

  useEffect(() => {
    if (user && user.userID) {
      setUserId(user.userID); // Đồng bộ userID khi có từ context
    }
  }, [user]);

  const handleJoinClick = async () => {
  if (!currentLocation) {
    alert("Không thể xác định vị trí của bạn.");
    return;
  }

  const { lat, lng } = currentLocation;

  if (!userID) {
    alert("Bạn cần đăng nhập để tham gia nhóm chat.");
    return;
  }

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

    console.log("Response:", response.data);

    const conversationId = response.data.conversationId;

    if (conversationId) {
      alert(response.data.message || "Tham gia nhóm thành công!");
      navigate(`/chat/${conversationId}`); // <<< CHUYỂN HƯỚNG ĐẾN TRANG CHAT
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