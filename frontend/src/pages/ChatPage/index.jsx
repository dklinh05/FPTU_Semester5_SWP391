// src/pages/ChatPage/ChatPage.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { request } from "../../utils/httpRequest";
import styles from "./ChatPage.module.scss"; // ✅ Import SCSS module

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const currentUserId = token ? jwtDecode(token).userId : null;

  // Fetch danh sách cuộc trò chuyện của người dùng
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const response = await request.get("/conversations", {
          params: { userId: currentUserId },
        });
        setConversations(response.data);
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
      if (!conversationId) return;
      setLoading(true);
      try {
        const response = await request.get(`/conversations/${conversationId}/messages`);
        setMessages(response.data);
      } catch (err) {
        setError(`Không thể tải tin nhắn`);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (!content.trim() || !conversationId) return;

    setLoading(true);
    setError(null);

    try {
      await request.post(
        `/conversations/${conversationId}/messages`,
        {
          conversationId: Number(conversationId),
          userId: currentUserId,
          content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContent("");
      const msgResponse = await request.get(`/conversations/${conversationId}/messages`);
      setMessages(msgResponse.data);
    } catch (err) {
      setError(`Không thể gửi tin nhắn`);
    } finally {
      setLoading(false);
    }
  };

  // Chọn cuộc trò chuyện
  const handleConversationSelect = (id) => {
    navigate(`/chat/${id}`);
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
        <div className={styles.chatSearchBox}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm..."
            />
            <span className="input-group-btn">
              <button className="btn btn-primary">Tìm</button>
            </span>
          </div>
        </div>

        <div className={styles.usersContainer}>
          <ul className={styles.users}>
            {loading && <p className={styles.loading}>Đang tải...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!conversationId && (
              <p className={styles.noChat}>Vui lòng chọn một cuộc trò chuyện.</p>
            )}
            {conversations.map((conv) => (
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
                  <img
                    src={conv.supplier?.avatar || "https://via.placeholder.com/48 "}
                    alt="User"
                  />
                  <div className={`${styles.status} ${styles.online}`}></div>
                </div>
                <p className={styles.nameTime}>
                  {conv.name || `Nhà cung cấp #${conv.conversationId}`}
                  <span className={styles.time}>
                    {conv.lastMessageTime
                      ? new Date(conv.lastMessageTime).toLocaleTimeString("vi-VN")
                      : new Date(conv.createdAt).toLocaleTimeString("vi-VN")}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content - Nội dung cuộc trò chuyện */}
      <div className={styles.chatArea}>
        <div className={styles.selectedUser}>
          <span className={styles.name}>
            {conversations.find(
              (c) => c.conversationId.toString() === conversationId
            )?.name || `Cuộc trò chuyện #${conversationId}`}
          </span>
        </div>

        {/* Khung tin nhắn */}
        <div className={styles.messageContainer}>
          {messages.map((msg) => (
            <div
              key={msg.messageId}
              className={
                msg.senderId === currentUserId
                  ? styles.chatRight
                  : styles.chatLeft
              }
            >
              <div className={styles.chatAvatar}>
                <img
                  src="https://via.placeholder.com/48 "
                  alt="User"
                  className={styles.avatar}
                />
              </div>
              <div className={styles.chatText}>{msg.content}</div>
              <small className={styles.chatHour}>
                {new Date(msg.sentAt).toLocaleTimeString("vi-VN")}
              </small>
            </div>
          ))}
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