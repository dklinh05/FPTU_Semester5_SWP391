import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { request } from "../../utils/httpRequest";
import { getUserById } from "../../services/userService"; // Service lấy thông tin người dùng
import styles from "./ChatPage.module.scss";

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUserId = token ? jwtDecode(token).userId : null;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [avatars, setAvatars] = useState({});

  // Lấy danh sách cuộc trò chuyện của người dùng
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const response = await request.get("/conversations", {
          params: { userId: currentUserId },
        });

        const conversationsWithUsers = response.data || [];

        // Lấy tất cả userId khác để tải avatar
        const userIdsToFetch = [];
        conversationsWithUsers.forEach((conv) => {
          conv.userIds?.forEach((uid) => {
            if (uid !== currentUserId && !avatars[uid]) {
              userIdsToFetch.push(uid);
            }
          });
        });

        // Tải avatar cho từng user chưa có
        await Promise.all(userIdsToFetch.map((id) => fetchAvatar(id)));

        setConversations(conversationsWithUsers);
      } catch (err) {
        setError("Không thể tải danh sách cuộc trò chuyện");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId]);

  // Lấy tin nhắn trong cuộc trò chuyện đang chọn
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId || isNaN(Number(conversationId))) {
        setError("ID cuộc trò chuyện không hợp lệ");
        return;
      }
      setLoading(true);
      try {
        const response = await request.get(`/conversations/${conversationId}/messages`);
        setMessages(response.data);
      } catch (err) {
        setError(`Không thể tải tin nhắn: ${err.message}`);
        console.error("Lỗi khi tải tin nhắn:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Hàm tải avatar người dùng
  const fetchAvatar = async (userId) => {
    if (!userId || avatars[userId]) return;
    try {
      const user = await getUserById(userId);
      setAvatars((prev) => ({
        ...prev,
        [userId]: user.avatar || "https://via.placeholder.com/48 ",
      }));
    } catch (err) {
      setAvatars((prev) => ({
        ...prev,
        [userId]: "https://via.placeholder.com/48 ",
      }));
    }
  };

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (!content.trim() || !conversationId) return;

    setLoading(true);
    setError(null);

    try {
      await request.post(`/conversations/${conversationId}/messages`, {
        conversationId: Number(conversationId),
        userId: currentUserId,
        content,
      });

      setContent("");
      const msgResponse = await request.get(`/conversations/${conversationId}/messages`);
      setMessages(msgResponse.data);
    } catch (err) {
      setError("Không thể gửi tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  // Chọn cuộc trò chuyện
  const handleConversationSelect = (id) => {
    navigate(`/chat/${id}`);
  };

  // Trả về tên cuộc trò chuyện hiện tại
  const getCurrentConversationName = () => {
    const selectedConv = conversations.find(
      (c) => c.conversationId.toString() === conversationId
    );
    if (!selectedConv) return "Chưa chọn cuộc trò chuyện";

    const otherUserIds = selectedConv.userIds?.filter((uid) => uid !== currentUserId);
    const otherUserId = otherUserIds?.[0];

    return `Cuộc trò chuyện #${selectedConv.conversationId}`;
  };

  if (!currentUserId) {
    return (
      <div className={styles.loginPrompt}>
        Vui lòng đăng nhập để xem cuộc trò chuyện.
      </div>
    );
  }

  return (
    <div className={styles.chatContainerWrapper}>
      {/* Sidebar - Danh sách cuộc trò chuyện */}
      <div className={styles.sidebar}>
          {/* === THÊM MỚI TẠI ĐÂY === */}
  <div className={styles["sidebar-header"]}>
    <div className={styles["lg-logo"]}>
      <a href="http://localhost:5173/">
        <span>Back To FarmTrade</span>
      </a>
    </div>
  </div>
  {/* === KẾT THÚC PHẦN THÊM MỚI === */}

        <div className={styles.chatSearchBox}>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Tìm kiếm..." />
            <span className="input-group-btn">
              <button className="btn btn-primary">Tìm</button>
            </span>
          </div>
        </div>

        <div className={styles.usersContainer}>
          <ul className={styles.users}>
            {loading && <p className={styles.loading}>Đang tải...</p>}
            {!conversationId && (
              <p className={styles.noChat}>Vui lòng chọn một cuộc trò chuyện.</p>
            )}
            {conversations.map((conv) => {
              const otherUserIds = conv.userIds?.filter((uid) => uid !== currentUserId);
              const otherUserId = otherUserIds?.[0];
              const avatar = avatars[otherUserId];

              return (
                <li
                  key={conv.conversationId}
                  className={`${styles.person} ${
                    conversationId === conv.conversationId.toString()
                      ? styles.activeUser
                      : ""
                  }`}
                  onClick={() => handleConversationSelect(conv.conversationId)}
                >
                  <div className={styles.user}>
                    <img src={avatar} alt="User Avatar" />
                    <div className={`${styles.status} ${styles.online}`}></div>
                  </div>
                  <p className={styles.nameTime}>
                    {getCurrentConversationName()}
                    <span className={styles.time}>
                      {new Date(conv.createdAt).toLocaleTimeString("vi-VN")}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Main Content - Nội dung cuộc trò chuyện */}
      <div className={styles.chatArea}>
        <div className={styles.selectedUser}>
          <span className={styles.name}>{getCurrentConversationName()}</span>
        </div>

        {/* Khung tin nhắn */}
        <div className={styles.messageContainer}>
          {messages.length === 0 && !loading && (
            <p className={styles.emptyMessage}>Chưa có tin nhắn nào.</p>
          )}
          {messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            const avatar = avatars[msg.senderId] || "https://via.placeholder.com/48 ";

            return (
              <div
                key={msg.messageId}
                className={isMine ? styles.chatRight : styles.chatLeft}
              >
                <div className={styles.chatAvatar}>
                  <img src={avatar} alt="User" className={styles.avatar} />
                </div>
                <div className={styles.chatText}>{msg.content}</div>
                <small className={styles.chatHour}>
                  {new Date(msg.sentAt).toLocaleTimeString("vi-VN")}
                </small>
              </div>
            );
          })}
        </div>

        {/* Form nhập tin nhắn */}
        <div className={styles.chatForm}>
          <textarea
            rows="3"
            placeholder="Nhập tin nhắn..."
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <button
            onClick={handleSendMessage}
            disabled={loading || !content.trim()}
            className="btn btn-primary mt-2"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;