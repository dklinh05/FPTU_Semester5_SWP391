import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { addProductToCart } from "../../services/cartItemService";
import { getReviewsByProductId } from "../../services/feedbackService";
import { getExistingConversation, createConversation } from "../../services/chatService";
import "../../../src/components/SidebarDetail/SideBarDetail.module.scss";

function Product({ product }) {
  const { userId } = useUser();
  const { setReload } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  // Extract supplier ID from product.supplier.userId
  const supplierId = product.supplier?.userId || product.supplier?.userID;

  // Debug product data and userId
  useEffect(() => {
    console.log("Product: userId =", userId);
    console.log("Product data:", JSON.stringify(product, null, 2));
    if (!supplierId) {
      console.warn("Supplier ID is missing. Expected: product.supplier.userId or userID");
    }
  }, [product, supplierId, userId]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleChangeInput = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(!isNaN(value) && value > 0 ? value : 1);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productData = new FormData();
    productData.append("buyerId", userId);
    productData.append("productId", product.productID);
    productData.append("quantity", quantity);

    try {
      await addProductToCart(productData);
      setReload((prev) => !prev);
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

const handleChatWithSupplier = async () => {
  console.log("handleChatWithSupplier: userId =", userId, "supplierId =", supplierId);
  if (!userId) {
    alert("Vui lòng đăng nhập để chat với nhà cung cấp");
    navigate("/login");
    return;
  }
  if (!supplierId) {
    setChatError("Không tìm thấy nhà cung cấp cho sản phẩm này");
    return;
  }
  setChatLoading(true);
  setChatError(null);
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  console.log("Token used:", token);
  try {
    console.log("Calling getExistingConversation with userId =", userId, "supplierId =", supplierId, "token =", token);
    const existingConversationId = await getExistingConversation(userId, supplierId, token);
    console.log("Existing conversation ID:", existingConversationId);
    if (existingConversationId) {
      navigate(`/chat/${existingConversationId}`);
    } else {
      console.log("Creating new conversation with userIds =", [userId, supplierId]);
      const conversationId = await createConversation([userId, supplierId], false, null, token);
      console.log("New conversation ID:", conversationId);
      navigate(`/chat/${conversationId}`);
    }
  } catch (err) {
    console.error("Chat error:", err);
    if (err.response?.status === 0 || err.message.includes('CORS')) {
      console.warn("CORS error or network issue detected. Ensure server allows origin 'http://localhost:5173'.");
      setChatError("Lỗi kết nối, vui lòng kiểm tra cấu hình server hoặc đăng nhập lại.");
    } else if (err.response?.status === 500) {
      console.warn("Server error 500 detected. Details:", err.response?.data || err.message);
      setChatError("Lỗi server, vui lòng thử lại sau hoặc liên hệ hỗ trợ.");
      try {
        const retryConversationId = await getExistingConversation(userId, supplierId, token);
        if (retryConversationId) {
          navigate(`/chat/${retryConversationId}`);
        } else {
          const newConversationId = await createConversation([userId, supplierId], false, null, token);
          navigate(`/chat/${newConversationId}`);
        }
      } catch (retryErr) {
        console.error("Retry failed:", retryErr);
        setChatError(`Không thể bắt đầu chat: ${retryErr.message}`);
      }
    } else {
      setChatError(`Không thể bắt đầu chat: ${err.message}`);
    }
  } finally {
    setChatLoading(false);
  }
};

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByProductId(product.productID);
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };
    if (product?.productID) fetchReviews();
  }, [product]);

  const renderStars = (count, forceGray = false) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fa fa-star ${forceGray ? "text-secondary" : i < count ? "text-warning" : "text-secondary"}`}
      />
    ));
  };

  const getAverageRating = () => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => {
      const avg = (r.productQuality + r.sellerService + r.deliverySpeed) / 3;
      return sum + avg;
    }, 0);
    return total / reviews.length;
  };

  const average = getAverageRating();

  return (
    <>
      {/* Product Image and Details */}
      <div className="col-lg-6">
        <div className="border rounded">
          <img
            src={product.imageURL || "img/single-item.jpg"}
            className="img-fluid rounded"
            alt={product.name}
          />
        </div>
      </div>

      <div className="col-lg-6">
        <h4 className="fw-bold mb-3">{product.name}</h4>
        <p className="mb-3">Category: {product.category}</p>
        <h5 className="fw-bold mb-3">{product.price} VND / {product.unit}</h5>
        <p className="mb-4">{product.description}</p>

        {/* Quantity Selector */}
        <div className="input-group quantity mb-5" style={{ width: "100px" }}>
          <div className="input-group-btn">
            <button
              className="btn btn-sm btn-minus rounded-circle bg-light border"
              onClick={decreaseQuantity}
            >
              <i className="fa fa-minus"></i>
            </button>
          </div>
          <input
            type="text"
            className="form-control form-control-sm text-center border-0"
            value={quantity}
            onChange={handleChangeInput}
          />
          <div className="input-group-btn">
            <button
              className="btn btn-sm btn-plus rounded-circle bg-light border"
              onClick={increaseQuantity}
            >
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
        <div
          className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
          onClick={handleAddToCart}
        >
          <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
        </div>

        <div>
          <button
            className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary ms-2"
            onClick={handleChatWithSupplier}
            disabled={chatLoading || !supplierId}
          >
            <i className="fa fa-comments me-2 text-primary"></i>
            {chatLoading ? "Đang tải..." : "Chat with Supplier"}
          </button>
          {chatError && <p className="text-danger">{chatError}</p>}
        </div>
      </div>

      {/* Product Ratings Section */}
      <div className="product-ratings-section col-12 mt-5">
        <h3 className="fw-bold">Product Ratings</h3>
        <div className="p-4 rounded bg-light border mb-3">
          <h4 className="fw-bold mb-2 text-danger">
            {reviews.length === 0
              ? "0.0"
              : (
                Math.round(
                  (reviews.reduce(
                    (sum, r) =>
                      sum + (r.productQuality + r.sellerService + r.deliverySpeed) / 3,
                    0
                  ) /
                  reviews.length) *
                  10
                ) / 10
              ).toFixed(1)}
            {" "}out of 5
          </h4>
          <div className="d-flex mb-3">
            {renderStars(
              reviews.length === 0
                ? 0
                : Math.round(
                  reviews.reduce(
                    (sum, r) =>
                      sum + (r.productQuality + r.sellerService + r.deliverySpeed) / 3,
                    0
                  ) / reviews.length
                ),
              reviews.length === 0
            )}
          </div>

          {/* Filter Buttons (Optional) */}
          <div className="d-flex flex-wrap gap-2">
            {["All", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star", "With Comments", "With Media"].map(
              (label, i) => (
                <button key={i} className="btn btn-sm border text-warning px-3 rounded-pill">
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* User Reviews */}
        {reviews.length === 0 ? (
          <p className="text-muted">Chưa có đánh giá nào.</p>
        ) : (
          reviews.map((rev, idx) => {
            const avg = (rev.productQuality + rev.sellerService + rev.deliverySpeed) / 3;
            const rounded = Math.floor(avg) + (avg % 1 >= 0.5 ? 1 : 0);
            const formattedDate = new Date(rev.reviewDate).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            const username = rev.buyer?.username || "Người dùng";
            const maskedUsername =
              username.length <= 2
                ? username
                : username[0] + "*".repeat(username.length - 2) + username[username.length - 1];

            return (
              <div className="border rounded p-3 mb-3" key={idx}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-bold">{maskedUsername}</div>
                </div>

                <div className="d-flex align-items-center gap-2 mb-3">
                  {renderStars(rounded)}
                  <span className="text-muted small">({avg.toFixed(1)})</span>
                </div>

                {rev.comment && <p className="mb-2">{rev.comment}</p>}

                {rev.imageList?.length > 0 && (
                  <div className="d-flex gap-2 mt-2">
                    {rev.imageList.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`review-${i}`}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default Product;