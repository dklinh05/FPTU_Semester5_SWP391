import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  renderNotifications,
  readNotifications,
} from "../../services/notificationService";

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Gọi API lấy danh sách thông báo khi mount
    const fetchNotifications = async () => {
      try {
        const data = await renderNotifications(userId, 0 ,5);
        setNotifications(data.content || []);
      } catch (err) {
        console.error("Lỗi khi lấy thông báo:", err);
      }
    };

    fetchNotifications();
  }, [userId]);

  const count = notifications.length;

  const handleNotificationClick = async (id, type, referenceId = 1, role) => {
    switch (formatType(type)) {
      case "ORDER":
        navigate(`/${role.slice(0).toLowerCase()}/order-detail/${referenceId}`);
        break;
      case "WITHDRAWAL":
        navigate(`/withdraw/${referenceId}`);
        break;
      case "MESSAGE":
        navigate(`/messages/${referenceId}`);
        break;
      default:
        navigate("/notifications");
        break;
    }
    await readNotifications(id);
  };

  function formatType(type) {
    if (!type) return "";
    const firstPart = type.split("_")[0]; // Lấy phần đầu
    return firstPart;
  }

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
                <li
                  key={n.notificationID}
                  className="p-2 rounded cursor-pointer position-relative hover:bg-light transition list-unstyled"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e9ecef")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                  onClick={() =>
                    handleNotificationClick(
                      n.notificationID,
                      n.type,
                      n.contentID,
                      n.user.role
                    )
                  }
                >
                  <div className="fw-semibold d-flex align-items-center justify-content-between">
                    <span>{n.title}</span>

                    {/* Dấu chấm đỏ nếu chưa đọc */}
                    {!n.isRead && (
                      <span
                        className="bg-danger rounded-circle"
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          marginLeft: "8px",
                        }}
                      ></span>
                    )}
                  </div>
                  <div className="text-dark small">{n.message}</div>
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
