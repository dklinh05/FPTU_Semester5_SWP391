import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { request } from "../../utils/httpRequest";
import { getUserById } from "../../services/userService";
import styles from "./ChatPage.module.scss";

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : {};
  const currentUserId = decodedToken.userId || null;
  const currentUserRole = decodedToken.scope && decodedToken.scope.includes("SUPPLIER") ? "SUPPLIER" : null;

  console.log("Debug - Token:", token);
  console.log("Debug - Decoded token:", decodedToken);
  console.log("Debug - Current user ID:", currentUserId);
  console.log("Debug - Current user role:", currentUserRole);

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

  const fetchProductDetails = async (productId) => {
    if (!productId || productDetails[productId]) return;
    try {
      const response = await request.get(`/products/${productId}`);
      console.log("Debug - Product details for ID:", productId, response.data);
      setProductDetails((prev) => ({
        ...prev,
        [productId]: {
          name: response.data.name || "Sản phẩm không xác định",
          imageURL: response.data.imageURL || "/img/fruite-item-1.jpg",
          price: response.data.price || 0,
          category: response.data.category || "Không xác định",
        },
      }));
    } catch (err) {
      console.error("Debug - Error fetching product details for ID:", productId, err);
      setProductDetails((prev) => ({
        ...prev,
        [productId]: {
          name: "Sản phẩm không xác định",
          imageURL: "/img/fruite-item-1.jpg",
          price: 0,
          category: "Không xác định",
        },
      }));
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const response = await request.get("/conversations", {
          params: { userId: currentUserId },
        });
        console.log("Debug - Conversations API response:", response.data);
        const conversationsWithUsers = response.data || [];
        setConversations(conversationsWithUsers);
        const userIdsToFetch = [];
        conversationsWithUsers.forEach((conv) => {
          console.log("Debug - Conversation:", conv.conversationId, "Group:", conv.group);
          conv.userIds?.forEach((uid) => {
            if (!avatars[uid] && !conv.group) {
              userIdsToFetch.push(uid);
            }
          });
        });

        await Promise.all(userIdsToFetch.map((id) => fetchAvatar(id)));
      } catch (err) {
        console.error("Debug - Error fetching conversations:", err);
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
        console.error("Debug - Invalid conversationId:", conversationId);
        setError("ID cuộc trò chuyện không hợp lệ");
        return;
      }
      setLoading(true);
      try {
        const response = await request.get(`/conversations/${conversationId}/messages`);
        console.log("Debug - Messages API response:", response.data);
        setMessages(response.data);

        const productIds = response.data
          .filter((msg) => msg.content.startsWith("PRODUCT:"))
          .map((msg) => msg.content.replace("PRODUCT:", ""));
        await Promise.all(productIds.map((id) => fetchProductDetails(id)));
      } catch (err) {
        console.error("Debug - Error fetching messages:", err);
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
      console.log("Debug - Fetched user avatar for userId:", userId, user);
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
      console.error("Debug - Error fetching avatar for userId:", userId, err);
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
      console.log("Debug - Members API response:", response.data);
      const membersData = response.data || [];
      setMembers(membersData);

      const userIdsToFetch = membersData
        .filter((member) => !avatars[member.userId])
        .map((member) => member.userId);
      await Promise.all(userIdsToFetch.map((id) => fetchAvatar(id)));
    } catch (err) {
      console.error("Debug - Error fetching members:", err);
      setError("Không thể tải danh sách thành viên");
    }
  };

  const fetchProducts = async () => {
    if (!currentUserId) return;
    try {
      const response = await request.get(`/conversations/products/supplier/${currentUserId}`);
      console.log("Debug - Products API response:", response.data);
      setProducts(response.data || []);
      setShowProductsModal(true);
    } catch (err) {
      console.error("Debug - Error fetching products:", err);
      setError("Không thể tải danh sách sản phẩm");
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
      console.log("Debug - Message sent successfully");
      setContent("");
      const msgResponse = await request.get(`/conversations/${conversationId}/messages`);
      setMessages(msgResponse.data);
    } catch (err) {
      console.error("Debug - Error sending message:", err);
      setError("Không thể gửi tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  const handleSendProduct = async (productId) => {
    if (!conversationId || !productId) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Debug - Sending product with ID:", productId);
      await request.post(`/conversations/${conversationId}/product-message`, {
        senderId: currentUserId,
        productId,
      });
      console.log("Debug - Product message sent successfully");
      setShowProductsModal(false);
      const msgResponse = await request.get(`/conversations/${conversationId}/messages`);
      setMessages(msgResponse.data);
      await fetchProductDetails(productId);
    } catch (err) {
      console.error("Debug - Error sending product:", err);
      setError(err.response?.data || "Không thể gửi sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (id) => {
    console.log("Debug - Selecting conversation:", id);
    navigate(`/chat/${id}`);
    setShowMembersModal(false);
    setShowProductsModal(false);
  };

  const handleViewMembers = () => {
    console.log("Debug - Viewing members for conversation:", conversationId);
    fetchMembers();
    setShowMembersModal(true);
  };

  const currentConversation = useMemo(() => {
    const conv = conversations.find((conv) => conv.conversationId?.toString() === conversationId);
    console.log("Debug - Current conversation:", conv);
    return conv;
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

  console.log("Debug - Should show send product button:", {
    isGroup: currentConversation?.group,
    isSupplier: currentUserRole === "SUPPLIER",
    showButton: currentConversation?.group && currentUserRole === "SUPPLIER",
  });

  if (!currentUserId) {
    console.log("Debug - No user ID, showing login prompt");
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
                      {formatSentAt(conv.createdAt)}
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
            const isProductMessage = msg.content.startsWith("PRODUCT:");
            const productId = isProductMessage ? msg.content.replace("PRODUCT:", "") : null;
            const product = productId ? productDetails[productId] : null;

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

                {isProductMessage ? (
                  <Link to={`/product/${productId}`} className={styles.productMessage}>
                    <img
                      src={product?.imageURL || "/img/fruite-item-1.jpg"}
                      alt="Product"
                      className={styles.productMessageImage}
                    />
                    <div className={styles.productInfo}>
                      <p className={styles.productName}>{product?.name || "Sản phẩm không xác định"}</p>
                      <p className={styles.productPrice}>
                        Giá: {product?.price ? `${product.price.toLocaleString("vi-VN")} VNĐ` : "Không xác định"}
                      </p>
                      <p className={styles.productCategory}>
                        Danh mục: {product?.category || "Không xác định"}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className={styles.chatText}>{msg.content}</div>
                )}

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

      {showProductsModal && (
        <div className={styles.productsModal}>
          <div className={styles.productsModalContent}>
            <h2>Danh sách sản phẩm</h2>
            <button
              className={styles.closeModalButton}
              onClick={() => setShowProductsModal(false)}
            >
              Đóng
            </button>
            <ul className={styles.productsList}>
              {products.map((product) => (
                <li key={product.productID} className={styles.productItem}>
                  <img
                    src={product.imageURL || "/img/fruite-item-1.jpg"}
                    alt="Product Image"
                    className={styles.productImage}
                  />
                  <div className={styles.productInfo}>
                    <span>{product.name || "Sản phẩm không xác định"}</span>
                    <span>Giá: {product.price ? `${product.price.toLocaleString("vi-VN")} VNĐ` : "Không xác định"}</span>
                    <span>Danh mục: {product.category || "Không xác định"}</span>
                    <button
                      onClick={() => handleSendProduct(product.productID)}
                      className={styles.sendProductButton}
                    >
                      Gửi
                    </button>
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