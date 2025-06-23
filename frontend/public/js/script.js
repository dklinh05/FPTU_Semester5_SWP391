const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// Api setup
const API_KEY = "AIzaSyCtIPry_4VCCOIOm0n_pyE0VEnemUgD_aQ";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
};

const chatHistory = [
  {
    role: "model",
    parts: [
      {
        text: `💻 Website **FarmTrade** là sản phẩm của một nhóm 4 lập trình viên trẻ trung, sáng tạo và đầy nhiệt huyết. Mỗi thành viên đều đóng vai trò quan trọng trong hành trình xây dựng nền tảng thương mại điện tử nông sản này:

1. **Đỗ Khánh Linh** – đảm nhiệm thiết kế giao diện người dùng (UI/UX) với phong cách hiện đại, dễ sử dụng và thân thiện. Linh là người biến ý tưởng thành trải nghiệm thực tế mượt mà.

2. **Trịnh Thị Thu Hà** – phụ trách toàn bộ quá trình **kiểm thử (testing)** và **tài liệu kỹ thuật**. Hà tỉ mỉ trong từng chi tiết, đảm bảo hệ thống hoạt động ổn định và có hướng dẫn rõ ràng cho cả người dùng lẫn nhà phát triển.

3. **Nguyễn Anh Tú** – chuyên về tích hợp hệ thống và xử lý backend phức tạp như thanh toán trực tuyến, xác thực bảo mật và giao tiếp với dịch vụ bên ngoài. Tú là người giữ cho hệ thống vận hành trơn tru và an toàn.

4. **Nguyễn Đình Phan Trung** – giữ vai trò kiến trúc sư chính, chịu trách nhiệm kết nối frontend và backend, đồng thời điều phối chung toàn dự án. Trung định hình nền tảng, đảm bảo hệ thống mở rộng tốt và có khả năng bảo trì cao.

Cùng nhau, họ đã phát triển nên FarmTrade – một giải pháp thông minh, đáng tin cậy cho cộng đồng nông sản Việt Nam.`,
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: `Bạn là một trợ lý ảo thông minh cho hệ thống thương mại rau củ quả. Dưới đây là dữ liệu hệ thống:

📦 **Sản phẩm**
1. *Cà chua Đà Lạt* – Giá: 25,000 VND/kg – Nhà cung cấp: UserID 53 – Nơi sản xuất: Đà Lạt
2. *Cải bó xôi* – Giá: 18,000 VND/kg – Nhà cung cấp: UserID 53 – Nơi sản xuất: Đồng Nai
3. *Khoai tây sạch* – Giá: 20,000 VND/kg – Nhà cung cấp: UserID 53 – Nơi sản xuất: Lâm Đồng
4. *Xoài cát Hòa Lộc* – Giá: 45,000 VND/kg – Nhà cung cấp: UserID 53 – Nơi sản xuất: Tiền Giang
5. *Dưa leo sạch* – Giá: 15,000 VND/kg – Nhà cung cấp: UserID 53 – Nơi sản xuất: Bình Thuận

🎁 **Voucher**
1. *SAVE50K* – Giảm 50,000 VND cho đơn trên 300,000 VND – Cần 100 điểm
2. *SALE10P* – Giảm 10% cho đơn trên 500,000 VND – Cần 200 điểm
3. *BIG100K* – Giảm 100,000 VND cho đơn từ 1,000,000 VND – Cần 500 điểm

👤 **Người dùng**
- UserID 53: Nhà cung cấp tên doanh nghiệp là \"Trang trại rau sạch Vinh Farm\", có chứng nhận \"Hữu cơ VietGAP\".

Hãy sử dụng thông tin này để trả lời các câu hỏi về sản phẩm, giá cả, voucher hoặc nhà cung cấp.`,
      },
    ],
  },
];

// const chatHistory = [];

const initialInputHeight = messageInput.scrollHeight;

// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Generate bot response using API
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  // chatHistory.push({
  //     role: "user",
  //     parts: [{ text: `Using the details provided above, please address this query: ${userData.message}` }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])],
  // });

  chatHistory.push({
    role: "user",
    parts: [
      { text: userData.message },
      ...(userData.file.data ? [{ inline_data: userData.file }] : []),
    ],
  });

  // API request options
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: chatHistory,
    }),
  };

  try {
    // Fetch bot response from API
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    // Extract and display bot's response text
    const apiResponseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();
    messageElement.innerText = apiResponseText;
    chatHistory.push({
      role: "model",
      parts: [{ text: apiResponseText }],
    });
  } catch (error) {
    messageElement.innerText = error.message;
    messageElement.style.color = "#ff0000";
  } finally {
    userData.file = {};
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ behavior: "smooth", top: chatBody.scrollHeight });
  }
};

// Handle outgoing user message
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  messageInput.value = "";
  fileUploadWrapper.classList.remove("file-uploaded");
  messageInput.dispatchEvent(new Event("input"));

  // Create and display user message
  const messageContent = `<div class="message-text"></div>
                            ${
                              userData.file.data
                                ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />`
                                : ""
                            }`;

  const outgoingMessageDiv = createMessageElement(
    messageContent,
    "user-message"
  );
  outgoingMessageDiv.querySelector(".message-text").innerText =
    userData.message;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Simulate bot response with thinking indicator after a delay
  setTimeout(() => {
    const messageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;

    const incomingMessageDiv = createMessageElement(
      messageContent,
      "bot-message",
      "thinking"
    );
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ behavior: "smooth", top: chatBody.scrollHeight });
    generateBotResponse(incomingMessageDiv);
  }, 600);
};

// Handle Enter key press for sending messages
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (
    e.key === "Enter" &&
    userMessage &&
    !e.shiftKey &&
    window.innerWidth > 768
  ) {
    handleOutgoingMessage(e);
  }
});

messageInput.addEventListener("input", (e) => {
  messageInput.style.height = `${initialInputHeight}px`;
  messageInput.style.height = `${messageInput.scrollHeight}px`;
  document.querySelector(".chat-form").style.boderRadius =
    messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

// Handle file input change event
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    const base64String = e.target.result.split(",")[1];

    // Store file data in userData
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };

    fileInput.value = "";
  };

  reader.readAsDataURL(file);
});

fileCancelButton.addEventListener("click", (e) => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});

const picker = new EmojiMart.Picker({
  theme: "light",
  showSkinTones: "none",
  previewPosition: "none",
  onEmojiSelect: (emoji) => {
    const { selectionStart: start, selectionEnd: end } = messageInput;
    messageInput.setRangeText(emoji.native, start, end, "end");
    messageInput.focus();
  },
  onClickOutside: (e) => {
    if (e.target.id === "emoji-picker") {
      document.body.classList.toggle("show-emoji-picker");
    } else {
      document.body.classList.remove("show-emoji-picker");
    }
  },
});

document.querySelector(".chat-form").appendChild(picker);

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!validImageTypes.includes(file.type)) {
    await Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)",
      confirmButtonText: "OK",
    });
    resetFileInput();
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    const base64String = e.target.result.split(",")[1];
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };
  };
  reader.readAsDataURL(file);
});

function resetFileInput() {
  fileInput.value = "";
  fileUploadWrapper.classList.remove("file-uploaded");
  fileUploadWrapper.querySelector("img").src = "#";
  userData.file = { data: null, mime_type: null };
  document.querySelector(".chat-form").reset();
}

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document
  .querySelector("#file-upload")
  .addEventListener("click", (e) => fileInput.click());
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
closeChatbot.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
