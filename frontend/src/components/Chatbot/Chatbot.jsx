import React, { useEffect, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import Swal from "sweetalert2";
import chatbotInitData from "../../data/ChatbotInitData";
import styles from "./Chatbot.module.scss";

const Chatbot = () => {
  const API_KEY = "AIzaSyCtIPry_4VCCOIOm0n_pyE0VEnemUgD_aQ";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const chatBodyRef = useRef(null);
  const messageInputRef = useRef(null);

  const [chatHistory, setChatHistory] = useState(chatbotInitData); // dùng cho Gemini API
  const [visibleMessages, setVisibleMessages] = useState([]); // chỉ dùng để hiển thị
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  // Chào mừng mặc định khi mở bot
  const initialWelcomeMessage = {
    role: "model",
    parts: [
      {
        text: "Xin chào! Tôi là FarmBot - trợ lý nông sản của bạn 🌿. Bạn có thể hỏi về sản phẩm, giá cả, voucher, hoặc nhà cung cấp.",
      },
    ],
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = {
      role: "user",
      parts: [
        { text: message },
        ...(file
          ? [{ inline_data: { mime_type: file.mime_type, data: file.data } }]
          : []),
      ],
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setVisibleMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setFile(null);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: updatedHistory }),
    };

    try {
      const response = await fetch(API_URL, requestOptions);
      const data = await response.json();

      const botMsg = {
        role: "model",
        parts: [
          {
            text: data.candidates[0].content.parts[0].text.trim(),
          },
        ],
      };

      setChatHistory((prev) => [...prev, botMsg]);
      setVisibleMessages((prev) => [...prev, botMsg]);

      setTimeout(() => {
        chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight);
      }, 100);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setFile({ data: base64, mime_type: selectedFile.type });
    };
    reader.readAsDataURL(selectedFile);
  };

  const insertEmoji = (emoji) => {
    const input = messageInputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newText = message.slice(0, start) + emoji.native + message.slice(end);
    setMessage(newText);
    setTimeout(() => input.focus(), 0);
  };

  return (
    <>
      <button
        id="chatbot-toggler"
        className={styles["chatbot-toggler"]}
        onClick={() => {
          setShowChatbot((prev) => {
            const next = !prev;
            if (next && visibleMessages.length === 0) {
              setVisibleMessages([initialWelcomeMessage]);
            }
            return next;
          });
        }}
      >
        <span className="material-symbols-rounded">mode_comment</span>
      </button>

      <div
        className={`${styles["chatbot-popup"]} ${
          showChatbot ? styles["show"] : ""
        }`}
      >
        <div className={styles["chat-header"]}>
          <div className={styles["header-info"]}>
            <div className={styles["chatbot-logo"]}>🤖</div>
            <span className={styles["logo-text"]}>FarmBot</span>
          </div>
          <button
            id="close-chatbot"
            className={styles["close-chatbot"]}
            onClick={() => setShowChatbot(false)}
          >
            ×
          </button>
        </div>

        <div className={styles["chat-body"]} ref={chatBodyRef}>
          {visibleMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.message} ${
                msg.role === "user"
                  ? styles["user-message"]
                  : styles["bot-message"]
              }`}
            >
              {msg.parts.map((part, i) => (
                <div className={styles["message-text"]} key={i}>
                  {part.inline_data && (
                    <img
                      src={`data:${part.inline_data.mime_type};base64,${part.inline_data.data}`}
                      alt="attachment"
                    />
                  )}

                  {part.text && <p>{part.text}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles["chat-footer"]}>
          <form className={styles["chat-form"]} onSubmit={handleSendMessage}>
            {file && (
              <img
                src={`data:${file.mime_type};base64,${file.data}`}
                className={styles["file-upload-wrapper"]}
                alt="file"
              />
            )}
            <textarea
              ref={messageInputRef}
              className={styles["message-input"]}
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />

            <div className={styles["chat-controls"]}>
              <button type="button" onClick={() => setPickerVisible((v) => !v)}>
                😊
              </button>
              {pickerVisible && (
                <div className={styles["emoji-picker"]}>
                  <Picker
                    data={data}
                    onEmojiSelect={insertEmoji}
                    theme="light"
                  />
                </div>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                hidden
                id="file-upload"
              />
              <label htmlFor="file-upload">📎</label>
              <button type="submit">⬆️</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
