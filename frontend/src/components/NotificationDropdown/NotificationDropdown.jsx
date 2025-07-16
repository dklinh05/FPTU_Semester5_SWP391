import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { renderNotifications } from "../../services/notificationService";

export default function NotificationDropdown() {
  const { userId } = useUser();
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Gọi API lấy danh sách thông báo khi mount
    const fetchNotifications = async () => {
      try {
        const data = await renderNotifications(userId);
        setNotifications(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy thông báo:", err);
      }
    };

    fetchNotifications();
  }, [userId]);

  const count = notifications.length;

  return (
    <Tippy
      interactive={true}
      visible={visible}
      onClickOutside={() => setVisible(false)}
      placement="bottom-end"
      render={() => (
        <div className="bg-white shadow-lg rounded-lg w-64 p-3 border text-sm z-50">
          <div className="fw-bold mb-2">Thông báo</div>
          {count > 0 ? (
            <ul className="mb-0">
              {notifications.map((n) => (
                <li key={n.id} className="p-2 hover:bg-light rounded">
                  {n.title}
                  <br />
                  {n.message}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted">Không có thông báo mới</div>
          )}
        </div>
      )}
    >
      <a
        className="position-relative me-4"
        onClick={() => setVisible((v) => !v)}
        style={{ cursor: "pointer", display: "inline-block" }}
      >
        <i className="fa fa-bell fa-2x"></i>
        {count > 0 && (
          <span
            className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
            style={{
              top: "-5px",
              left: "15px",
              height: "20px",
              minWidth: "20px",
              fontSize: "12px",
            }}
          >
            {count}
          </span>
        )}
      </a>
    </Tippy>
  );
}
