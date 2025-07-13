// src/components/CommunityChatBanner/CommunityChatBanner.jsx

import React from "react";
import styles from "./CommunityChatBanner.module.scss";

const CommunityChatBanner = () => {
  const handleJoinClick = () => {
    // Thay bằng logic điều hướng thực tế của bạn
    alert("Chuyển hướng tới nhóm chat cộng đồng");
    // Ví dụ: navigate("/community-chat")
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