import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { request } from "../../utils/httpRequest";


const API_BASE_URL = "/conversations";

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
        console.log("Fetching conversations for userId =", currentUserId);
        const response = await request.get(API_BASE_URL, {
          params: { userId: currentUserId },
        });
        console.log("Conversations response:", response.data);
        setConversations(response.data);
      } catch (err) {
        console.error("Error fetching conversations:", err.response?.data || err.message);
        setError("Không thể tải danh sách cuộc trò chuyện");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId]);

  // Làm mới danh sách cuộc trò chuyện
  const refreshConversations = async () => {
    if (!currentUserId) return;
    try {
      const response = await request.get(API_BASE_URL, {
        params: { userId: currentUserId },
      });
      setConversations(response.data);
    } catch (err) {
      console.error("Error refreshing conversations:", err.response?.data || err.message);
    }
  };

  // Lấy tin nhắn trong cuộc trò chuyện đang chọn
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      setLoading(true);
      try {
        console.log("getMessages: conversationId =", conversationId);
        const response = await request.get(`${API_BASE_URL}/${conversationId}/messages`);
        console.log("getMessages: response =", response.data);
        setMessages(response.data);
      } catch (err) {
        console.error("getMessages error:", err.response?.data || err.message);
        setError(`Không thể tải tin nhắn: ${err.message}`);
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
      console.log(
        "sendMessage: currentUserId =",
        currentUserId,
        "conversationId =",
        conversationId,
        "content =",
        content
      );
      await request.post(
        `${API_BASE_URL}/${conversationId}/messages`,
        {
          conversationId: Number(conversationId),
          userId: currentUserId,
          content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("sendMessage: success");
      setContent("");
      const msgResponse = await request.get(`${API_BASE_URL}/${conversationId}/messages`);
      setMessages(msgResponse.data);
    } catch (err) {
      console.error("sendMessage error:", err.response?.data || err.message);
      setError(`Không thể gửi tin nhắn: ${err.message}`);
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
      <div className="text-center text-red-500 mt-4">
        Vui lòng đăng nhập để xem cuộc trò chuyện.
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Danh sách cuộc trò chuyện (chiếm 25%) */}
      <div className="w-1/4 bg-white p-4 border-r shadow-md overflow-y-auto">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Danh sách cuộc trò chuyện</h3>
        {loading && <p className="text-gray-500">Đang tải...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-2">
          {conversations.map((conv) => (
            <li
              key={conv.conversationId}
              className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
                conversationId === conv.conversationId.toString()
                  ? "bg-blue-100"
                  : ""
              }`}
              onClick={() => handleConversationSelect(conv.conversationId)}
            >
              <div className="text-sm font-medium">
                {conv.name || `Nhà cung cấp #${conv.conversationId}`}
              </div>
              <div className="text-xs text-gray-500">
                {conv.lastMessageTime
                  ? new Date(conv.lastMessageTime).toLocaleTimeString("vi-VN")
                  : new Date(conv.createdAt).toLocaleTimeString("vi-VN")}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content - Nội dung cuộc trò chuyện (chiếm 75%) */}
      <div className="w-3/4 flex flex-col bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {conversations.find(
              (c) => c.conversationId.toString() === conversationId
            )?.name || `Cuộc trò chuyện #${conversationId}`}
          </h2>
        </div>

        {/* Khung tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 bg-white" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {loading && <p className="text-gray-500">Đang tải...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!conversationId && (
            <p className="text-gray-500">Vui lòng chọn một cuộc trò chuyện.</p>
          )}

          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.messageId}
                className={`${
                  msg.senderId === currentUserId ? "text-right" : "text-left"
                }`
                }
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg ${
                    msg.senderId === currentUserId
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.sentAt).toLocaleTimeString("vi-VN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form nhập tin nhắn */}
        <div className="p-4 border-t bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;