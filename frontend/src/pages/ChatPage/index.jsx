import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { request } from "../../utils/httpRequest";
import { getUserById } from "../../services/userService";
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
  const [members, setMembers] = useState([]);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const formatSentAt = (sentAt) => {
    if (!sentAt) return "Không có thời gian";

    if (typeof sentAt === "string") {
      const date = new Date(sentAt);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("vi-VN");
      }
    }

    if (Array.isArray(sentAt) && sentAt.length >= 5) {
      const [year, month, day, hour, minute] = sentAt;
      const date = new Date(year, month - 1, day, hour, minute);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("vi-VN");
      }
    }

    return "Thời gian không hợp lệ";
  };

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const response = await request.get("/conversations", {
          params: { userId: currentUserId },
        });

        const conversationsWithUsers = response.data || [];
        const userIdsToFetch = [];
        conversationsWithUsers.forEach((conv) => {
          conv.userIds?.forEach((uid) => {
            if (!avatars[uid] && !conv.group) {
              userIdsToFetch.push(uid);
            }
          });
        });

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
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  const fetchAvatar = async (userId) => {
    if (!userId || avatars[userId]) return;
    try {
      const user = await getUserById(userId);
      setAvatars((prev) => ({
        ...prev,
        [userId]: {
          avatarUrl: user.avatar || "/img/fruite-item-1.jpg",
          businessName: user.businessName || null,
          role: user.role || null,
          userId: userId,
        },
      }));
    } catch (err) {
      setAvatars((prev) => ({
        ...prev,
        [userId]: {
          avatarUrl: "https://via.placeholder.com/48",
          businessName: null,
          role: null,
          userId: userId,
        },
      }));
    }
  };

  const fetchMembers = async () => {
    if (!conversationId) return;
    try {
      const response = await request.get(`/conversations/${conversationId}/members`);
      const membersData = response.data || [];
      setMembers(membersData);

      const userIdsToFetch = membersData
        .filter((member) => !avatars[member.userId])
        .map((member) => member.userId);
      await Promise.all(userIdsToFetch.map((id) => fetchAvatar(id)));
    } catch (err) {
      setError("Không thể tải danh sách thành viên");
    }
  };

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

  const handleConversationSelect = (id) => {
    navigate(`/chat/${id}`);
    setShowMembersModal(false);
  };

  const handleViewMembers = () => {
    fetchMembers();
    setShowMembersModal(true);
  };

  const currentConversation = useMemo(() => {
    return conversations.find((conv) => conv.conversationId?.toString() === conversationId);
  }, [conversationId, conversations]);

  const currentConversationName = useMemo(() => {
    if (!conversationId) return "Chọn cuộc trò chuyện";

    const currentConv = conversations.find(
      (conv) => conv.conversationId?.toString() === conversationId
    );

    if (!currentConv) return "Không tìm thấy cuộc trò chuyện";

    if (currentConv.group) {
      return currentConv.name || "Nhóm chưa đặt tên";
    }

    const otherUserId = currentConv.userIds?.find((uid) => uid !== currentUserId);
    const user = avatars[otherUserId];
    return user?.businessName || `Người dùng #${otherUserId}`;
  }, [conversationId, conversations, avatars, currentUserId]);

  if (!currentUserId) {
    return (
      <div className={styles.loginPrompt}>
        Vui lòng đăng nhập để xem cuộc trò chuyện.
      </div>
    );
  }

  return (
    <div className={styles.chatContainerWrapper}>
      <div className={styles.sidebar}>
        <div className={styles["sidebar-header"]}>
          <div className={styles["lg-logo"]}>
            <a href="http://localhost:5173/">
              <span>Back To FarmTrade</span>
            </a>
          </div>
        </div>

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
              let displayName;
              let displayAvatar;

              if (conv.group) {
                displayName = conv.name || "Nhóm chưa đặt tên";
                displayAvatar = "/img/fruite-item-1.jpg";
              } else {
                const otherUserId = conv.userIds?.find((uid) => uid !== currentUserId);
                const user = avatars[otherUserId];
                displayName = user?.businessName || `Người dùng #${otherUserId}`;
                displayAvatar = user?.avatarUrl || "https://via.placeholder.com/48";
              }

              return (
                <li
                  key={conv.conversationId}
                  className={`${styles.person} ${
                    conversationId === conv.conversationId.toString() ? styles.activeUser : ""
                  }`}
                  onClick={() => handleConversationSelect(conv.conversationId)}
                >
                  <div className={styles.user}>
                    <img src={displayAvatar} alt="Conversation Avatar" />
                    <div className={`${styles.status} ${styles.online}`}></div>
                  </div>
                  <p className={styles.nameTime}>
                    {displayName}
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

      <div className={styles.chatArea}>
        <div className={styles.selectedUser}>
          <span className={styles.name}>{currentConversationName}</span>
          {currentConversation?.group && (
            <button className={styles.viewMembersButton} onClick={handleViewMembers}>
              Xem Thành Viên
            </button>
          )}
        </div>

        <div className={styles.messageContainer}>
          {messages.length === 0 && !loading && (
            <p className={styles.emptyMessage}>Chưa có tin nhắn nào.</p>
          )}

          {messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            const avatar = avatars[msg.senderId]?.avatarUrl || "https://via.placeholder.com/48";

            return (
              <div
                key={msg.messageId}
                className={`${isMine ? styles.chatRight : styles.chatLeft}`}
              >
                {!isMine && (
                  <div className={styles.chatAvatar}>
                    <img src={avatar} alt="User Avatar" className={styles.avatar} />
                  </div>
                )}

                <div className={styles.chatText}>{msg.content}</div>

                {isMine && (
                  <div className={styles.chatAvatar}>
                    <img src={avatar} alt="User Avatar" className={styles.avatar} />
                  </div>
                )}

                <small className={styles.chatHour}>
                  {formatSentAt(msg.sentAt)}
                </small>
              </div>
            );
          })}
        </div>

        <div className={styles.chatForm}>
          <div className={styles.inputWithButton}>
            <textarea
              rows="1"
              placeholder="Nhập tin nhắn..."
              className="form-control"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !content.trim()}
              className={styles.sendButton}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      {showMembersModal && (
        <div className={styles.membersModal}>
          <div className={styles.membersModalContent}>
            <h2>Danh sách thành viên</h2>
            <button
              className={styles.closeModalButton}
              onClick={() => setShowMembersModal(false)}
            >
              Đóng
            </button>
            <ul className={styles.membersList}>
              {members.map((member) => (
                <li key={member.userId} className={styles.memberItem}>
                  <img
                    src={avatars[member.userId]?.avatarUrl || "https://via.placeholder.com/48"}
                    alt="Member Avatar"
                    className={styles.memberAvatar}
                  />
                  <div className={styles.memberInfo}>
                    <span>{avatars[member.userId]?.businessName || `Người dùng #${member.userId}`}</span>
                    <span>UserID: {member.userId}</span>
                    <span>Vai trò: {avatars[member.userId]?.role || member.role || "Thành viên"}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;