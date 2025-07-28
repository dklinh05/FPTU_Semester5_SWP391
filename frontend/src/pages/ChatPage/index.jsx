// src/pages/ChatPage/ChatPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../../services/userService";
import { toast } from "react-toastify";
import styles from "./ChatPage.module.scss";

// Import các hàm từ chatService
import {
  getConversationsByUserId,
  getMessagesByConversationId,
  getConversationMembers,
  getSupplierProducts,
  sendMessage,
  sendProductMessage,
  getProductDetails,
} from "../../services/chatService";

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  // Lấy và giải mã token
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : {};
  const currentUserId = decodedToken.userId || null;
  const currentUserRole = decodedToken.scope?.includes("SUPPLIER") ? "SUPPLIER" : null;

  // State
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [avatars, setAvatars] = useState({});
  const [members, setMembers] = useState([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  // Định dạng thời gian
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

  // Fetch avatar người dùng
  const fetchAvatar = async (userId) => {
    if (!userId || avatars[userId]) return;
    try {
      const user = await getUserById(userId);
      setAvatars((prev) => ({
        ...prev,
        [userId]: {
          avatarUrl: user.avatar || "/img/fruite-item-1.jpg",
          businessName: user.businessName || null, // có thể null
          fullName: user.fullName || null,        // lấy fullName
          role: user.role || null,
          userId,
        },
      }));
    } catch (err) {
      setAvatars((prev) => ({
        ...prev,
        [userId]: {
          avatarUrl: "https://via.placeholder.com/48",
          businessName: null,
          fullName: null,
          role: null,
          userId,
        },
      }));
    }
  };
  // --- useEffect gọi service ---

  // Lấy danh sách cuộc trò chuyện
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const data = await getConversationsByUserId(currentUserId);
        setConversations(data);
        const userIdsToFetch = data
          .flatMap((conv) => conv.userIds || [])
          .filter((uid) => uid !== currentUserId && !avatars[uid]);
        await Promise.all(userIdsToFetch.map(fetchAvatar));
      } catch (err) {
        setError("Không thể tải danh sách cuộc trò chuyện");
        toast.error("Lỗi kết nối");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [currentUserId]);

  // Lấy tin nhắn và thành viên
  useEffect(() => {
    const fetchMessagesAndMembers = async () => {
      if (!conversationId || isNaN(Number(conversationId))) {
        setError("ID cuộc trò chuyện không hợp lệ");
        return;
      }
      setLoading(true);
      try {
        const messagesData = await getMessagesByConversationId(conversationId);
        setMessages(messagesData);

        // Lấy chi tiết sản phẩm nếu có
        const productIds = messagesData
          .filter((msg) => msg.content.startsWith("PRODUCT:"))
          .map((msg) => msg.content.replace("PRODUCT:", ""));
        await Promise.all(
          productIds.map(async (id) => {
            if (!productDetails[id]) {
              try {
                const product = await getProductDetails(id);
                setProductDetails((prev) => ({
                  ...prev,
                  [id]: {
                    name: product.name || "Sản phẩm không xác định",
                    imageURL: product.imageURL || "/img/fruite-item-1.jpg",
                    price: product.price || 0,
                    category: product.category || "Không xác định",
                  },
                }));
              } catch (err) {
                setProductDetails((prev) => ({
                  ...prev,
                  [id]: {
                    name: "Sản phẩm không xác định",
                    imageURL: "/img/fruite-item-1.jpg",
                    price: 0,
                    category: "Không xác định",
                  },
                }));
              }
            }
          })
        );
      } catch (err) {
        setError("Không thể tải tin nhắn");
        toast.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }

      // Lấy thành viên
      fetchMembers();
    };

    fetchMessagesAndMembers();
  }, [conversationId]);

  const fetchMembers = async () => {
    if (!conversationId) return;
    try {
      const data = await getConversationMembers(conversationId);
      setMembers(data);
      const userIdsToFetch = data
        .map((member) => member.userId)
        .filter((id) => !avatars[id]);
      await Promise.all(userIdsToFetch.map(fetchAvatar));
    } catch (err) {
      setError("Không thể tải thành viên");
      toast.error("Lỗi tải thành viên");
    }
  };

  const fetchProducts = async () => {
    if (!currentUserId) return;
    try {
      const data = await getSupplierProducts(currentUserId);
      setProducts(data);
      setShowProductsModal(true);
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm");
      toast.error("Lỗi tải sản phẩm");
    }
  };

  // --- Xử lý sự kiện ---

  const handleSendMessage = async () => {
    if (!content.trim() || !conversationId) return;
    setLoading(true);
    try {
      await sendMessage(conversationId, content);
      setContent("");
      const updatedMessages = await getMessagesByConversationId(conversationId);
      setMessages(updatedMessages);
      toast.success("Gửi tin nhắn thành công");
    } catch (err) {
      toast.error("Gửi thất bại: " + (err.message || "Lỗi mạng"));
    } finally {
      setLoading(false);
    }
  };

  const handleSendProduct = async (productId) => {
    if (!conversationId || !productId) return;
    setLoading(true);
    try {
      await sendProductMessage(conversationId, currentUserId, productId);
      setShowProductsModal(false);
      const updatedMessages = await getMessagesByConversationId(conversationId);
      setMessages(updatedMessages);
      if (!productDetails[productId]) {
        const product = await getProductDetails(productId);
        setProductDetails((prev) => ({
          ...prev,
          [productId]: {
            name: product.name || "Sản phẩm không xác định",
            imageURL: product.imageURL || "/img/fruite-item-1.jpg",
            price: product.price || 0,
            category: product.category || "Không xác định",
          },
        }));
      }
      toast.success("Gửi sản phẩm thành công");
    } catch (err) {
      toast.error("Gửi thất bại: " + (err.message || "Lỗi mạng"));
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (id) => {
    navigate(`/chat/${id}`);
    setShowMembersModal(false);
    setShowProductsModal(false);
  };

  const handleViewMembers = () => {
    fetchMembers();
    setShowMembersModal(true);
  };

  // Tính toán tên cuộc trò chuyện
  const currentConversation = useMemo(() => {
    return conversations.find((c) => c.conversationId?.toString() === conversationId) || null;
  }, [conversationId, conversations]);

  const currentConversationName = useMemo(() => {
    if (!conversationId) return "Chọn cuộc trò chuyện";
    if (!currentConversation) return "Không tìm thấy";

    if (currentConversation.group) {
      return currentConversation.name || "Nhóm chưa đặt tên";
    }

    const otherUserId = currentConversation.userIds?.find((uid) => uid !== currentUserId);
    const user = avatars[otherUserId];
    return user?.businessName
      ? user.businessName
      : user?.fullName
        ? user.fullName
        : `Người dùng #${otherUserId}`;
  }, [conversationId, currentConversation, avatars, currentUserId]);

  // Nếu chưa đăng nhập
  if (!currentUserId) {
    return (
      <div className={styles.loginPrompt}>
        Vui lòng đăng nhập để sử dụng chức năng chat.
      </div>
    );
  }

  return (
    <div className={styles.chatContainerWrapper}>
      {/* Sidebar */}
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
            {!conversationId && <p className={styles.noChat}>Chọn cuộc trò chuyện.</p>}
            {conversations.map((conv) => {
              const otherUserId = conv.userIds?.find((uid) => uid !== currentUserId);
              const user = avatars[otherUserId];
              const displayName = conv.group
                ? conv.name || "Nhóm chưa đặt tên"
                : user?.businessName
                  ? user.businessName
                  : user?.fullName
                    ? user.fullName
                    : `Người dùng #${otherUserId}`;
              const displayAvatar = conv.group
                ? "/img/fruite-item-1.jpg"
                : user?.avatarUrl || "https://via.placeholder.com/48";

              return (
                <li
                  key={conv.conversationId}
                  className={`${styles.person} ${conversationId === conv.conversationId.toString() ? styles.activeUser : ""
                    }`}
                  onClick={() => handleConversationSelect(conv.conversationId)}
                >
                  <div className={styles.user}>
                    <img src={displayAvatar} alt="Avatar" />
                    <div className={`${styles.status} ${styles.online}`}></div>
                  </div>
                  <p className={styles.nameTime}>
                    {displayName}
                    <span className={styles.time}>{formatSentAt(conv.createdAt)}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Chat Area */}
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
            const isProductMessage = msg.content.startsWith("PRODUCT:");
            const productId = isProductMessage ? msg.content.replace("PRODUCT:", "") : null;
            const product = productDetails[productId];

            return (
              <div key={msg.messageId} className={`${isMine ? styles.chatRight : styles.chatLeft}`}>
                {!isMine && (
                  <div className={styles.chatAvatar}>
                    <img src={avatar} alt="User" className={styles.avatar} />
                  </div>
                )}
                {isProductMessage ? (
                  <Link to={`/product/${productId}`} className={styles.productMessage}>
                    <img src={product?.imageURL || "/img/fruite-item-1.jpg"} alt="Product" className={styles.productMessageImage} />
                    <div className={styles.productInfo}>
                      <p className={styles.productName}>{product?.name || "Sản phẩm"}</p>
                      <p className={styles.productPrice}>Giá: {product?.price?.toLocaleString("vi-VN")} VNĐ</p>
                      <p className={styles.productCategory}>Danh mục: {product?.category || "Không xác định"}</p>
                    </div>
                  </Link>
                ) : (
                  <div className={styles.chatText}>{msg.content}</div>
                )}
                {isMine && (
                  <div className={styles.chatAvatar}>
                    <img src={avatar} alt="User" className={styles.avatar} />
                  </div>
                )}
                <small className={styles.chatHour}>{formatSentAt(msg.sentAt)}</small>
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
            {currentConversation?.group && currentUserRole === "SUPPLIER" && (
              <button
                onClick={fetchProducts}
                className={styles.sendProductButton}
                disabled={loading}
              >
                Gửi Sản Phẩm
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal xem thành viên */}
      {showMembersModal && (
        <div className={styles.membersModal}>
          <div className={styles.membersModalContent}>
            <h2>Danh sách thành viên</h2>
            <button className={styles.closeModalButton} onClick={() => setShowMembersModal(false)}>Đóng</button>
            <ul className={styles.membersList}>
              {members.map((member) => (
                <li key={member.userId} className={styles.memberItem}>
                  <img src={avatars[member.userId]?.avatarUrl || "https://via.placeholder.com/48"} alt="Member" className={styles.memberAvatar} />
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

      {/* Modal chọn sản phẩm */}
      {showProductsModal && (
        <div className={styles.productsModal}>
          <div className={styles.productsModalContent}>
            <h2>Danh sách sản phẩm</h2>
            <button className={styles.closeModalButton} onClick={() => setShowProductsModal(false)}>Đóng</button>
            <ul className={styles.productsList}>
              {products.map((product) => (
                <li key={product.productID} className={styles.productItem}>
                  <img src={product.imageURL || "/img/fruite-item-1.jpg"} alt="Product" className={styles.productImage} />
                  <div className={styles.productInfo}>
                    <span>{product.name || "Sản phẩm"}</span>
                    <span>Giá: {product.price?.toLocaleString("vi-VN")} VNĐ</span>
                    <span>Danh mục: {product.category || "Không xác định"}</span>
                    <button onClick={() => handleSendProduct(product.productID)} className={styles.sendProductButton}>Gửi</button>
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