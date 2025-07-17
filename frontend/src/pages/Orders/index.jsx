import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Spinner, Badge } from "react-bootstrap";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import {
  renderOrderByBuyerId,
  renderOrderItemsByOrderId,
} from "../../services/orderService";
import { addProductToCart } from "../../services/cartItemService";
import ReviewModal from "../../components/ReviewModal/ReviewModal";
import { checkIfReviewed, deleteReview, getReviewDetail } from "../../services/feedbackService";
import {toast} from "react-toastify";
import PopupModal from "../../components/PopupModal/index.js";

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  const { userId } = useUser();
  const { setReload } = useCart();
  const [orders, setOrders] = useState([]);
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewedItems, setReviewedItems] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState({ orderId: null, productId: null });

  const fetchOrders = async () => {
    try {
      let fetchedOrders = [];
      if (location.pathname === "/orders/rate") {
        fetchedOrders = await renderOrderByBuyerId(userId, "completed");
      } else {
        fetchedOrders = await renderOrderByBuyerId(userId, status);
      }

      const itemsMap = {};
      const reviewedMap = {};
      const ordersToSet = [];

      for (const order of fetchedOrders) {
        const items = await renderOrderItemsByOrderId(order.orderID);
        itemsMap[order.orderID] = items;

        let hasReviewableItem = false;

        for (const item of items) {
          const reviewed = await checkIfReviewed(item.productId, order.orderID);
          reviewedMap[`${order.orderID}_${item.productId}`] = reviewed;

          if (!reviewed) {
            hasReviewableItem = true;
          }
        }
        if (location.pathname === "/orders/rate") {
          if (order.status === "COMPLETED" && (hasReviewableItem || true)) {
            ordersToSet.push(order);
          }
        } else {
          ordersToSet.push(order);
        }
      }

      setOrders(ordersToSet);
      setOrderItemsMap(itemsMap);
      setReviewedItems(reviewedMap);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const handleDetailOrder = (id) => {
    navigate(`/order-information/${id}`);
  };

  const handleBuyAgain = async (items) => {
    const chooseCartItems = [];
    try {
      for (const item of items) {
        const productData = new FormData();
        productData.append("buyerId", userId);
        productData.append("productId", item.productId);
        productData.append("quantity", item.quantity);

        const response = await addProductToCart(productData);
        chooseCartItems.push({
          cartItemID: response.cartItemID, // tùy vào backend trả về
        });
        console.log("Đã thêm vào giỏ:", response.cartItemID);
      }
      setReload((prev) => !prev);
      navigate("/cart", { state: { cartItems: chooseCartItems } });
    } catch (error) {
      console.error("Lỗi khi mua lại:", error);
      toast.error("Có lỗi xảy ra khi mua lại. Vui lòng thử lại.");
    }
  };

  const handleFeedback = (orderId, product) => {
    setSelectedProduct({
      ...product,
      orderId: orderId,
    });
    setShowReviewModal(true);
  };

  const handleReviewSuccess = async () => {
    setShowReviewModal(false);
    if (selectedProduct) {
      const { orderId, productId } = selectedProduct;
      const reviewed = await checkIfReviewed(productId, orderId);
      setReviewedItems((prev) => ({
        ...prev,
        [`${orderId}_${productId}`]: reviewed,
      }));
    }
  };

  const confirmDeleteReview = (orderId, productId) => {
    setReviewToDelete({ orderId, productId });
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    const { orderId, productId } = reviewToDelete;
    try {
      const review = await getReviewDetail(productId, orderId);
      const reviewId = review.reviewID;

      await deleteReview(reviewId);

      const key = `${orderId}_${productId}`;
      setReviewedItems((prev) => ({ ...prev, [key]: false }));
      toast.success("Xóa đánh giá thành công!");
    } catch (err) {
      console.error("Delete review failed:", err);
      toast.error("Lỗi khi xóa đánh giá");
    } finally {
      setShowConfirmModal(false);
      setReviewToDelete({ orderId: null, productId: null });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId, location.search]);

  return (
    <div className="container mt-4">
      {orders.map((order) => (
        <Card className="mb-4" key={order.orderID}>
          <Card.Header className="d-flex justify-content-between">
            <div>
              <strong>Đơn hàng từ {order.supplierName}</strong>
            </div>
            <Badge bg={order.status === "CANCELLED" ? "danger" : "success"}>
              {order.status}
            </Badge>
          </Card.Header>

          <Card.Body>
            {orderItemsMap[order.orderID]?.map((item) => (
              <div className="d-flex mb-3" key={item.orderItemID}>
                <img
                  src={item.productImage || "https://via.placeholder.com/60"}
                  alt="item"
                  width={60}
                  height={60}
                  className="me-3"
                />
                <div>
                  <div>
                    <strong>{item.productName}</strong>
                  </div>
                  <div className="text-muted">Số lượng: {item.quantity}</div>
                  <div className="text-muted">
                    Giá: ₫{item.price.toLocaleString()}
                  </div>

                  {order.status === "COMPLETED" && (
                      reviewedItems[`${order.orderID}_${item.productId}`] ? (
                          location.pathname === "/orders" ? (
                              <div className="mt-2">
                                <Button
                                    size="sm"
                                    variant="outline-info"
                                    onClick={() => handleFeedback(order.orderID, {
                                      productId: item.productId,
                                      productName: item.productName,
                                      productImage: item.productImage,
                                      isEdit: true,
                                      isViewOnly: true // Flag chỉ để xem
                                    })}
                                >
                                  Xem đánh giá
                                </Button>
                              </div>
                          ) : (
                              <div className="mt-2 d-flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline-warning"
                                    onClick={() => handleFeedback(order.orderID, {
                                      productId: item.productId,
                                      productName: item.productName,
                                      productImage: item.productImage,
                                      isEdit: true
                                    })}
                                >
                                  Chỉnh sửa đánh giá
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => confirmDeleteReview(order.orderID, item.productId)}
                                >
                                  Xóa đánh giá
                                </Button>
                              </div>
                          )
                      ) : (
                          <Button
                              size="sm"
                              variant="outline-success"
                              className="mt-2"
                              onClick={() =>
                                  handleFeedback(order.orderID, {
                                    productId: item.productId,
                                    productName: item.productName,
                                    productImage: item.productImage,
                                    isEdit: false
                                  })
                              }
                          >
                            Đánh giá
                          </Button>
                      )
                  )}

                </div>
              </div>
            ))}

            <div className="text-end">
              <strong>Tổng tiền: ₫{order.totalAmount.toLocaleString()}</strong>
            </div>
          </Card.Body>

          <Card.Footer className="text-end d-flex justify-content-end gap-2">
            <Button
              variant="outline-primary"
              onClick={() => handleDetailOrder(order.orderID)}
            >
              Chi tiết
            </Button>
            {(order.status === "COMPLETED" || order.status === "CANCELLED") && (
              <Button
                variant="danger"
                onClick={() => handleBuyAgain(orderItemsMap[order.orderID])}
              >
                Mua lại
              </Button>
            )}
            {order.status === "PENDING" && (
              <Button
                variant="danger"
                onClick={() => handleBuyAgain(orderItemsMap[order.orderID])}
              >
                Hủy
              </Button>
            )}
          </Card.Footer>
        </Card>
      ))}
      {selectedProduct && (
        <ReviewModal
          show={showReviewModal}
          onHide={() => setShowReviewModal(false)}
          product={selectedProduct}
          onSuccess={handleReviewSuccess}
        />
      )}
      <PopupModal
          show={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteConfirmed}
          title="Xác nhận xóa đánh giá"
          body="Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác."
          confirmText="Xóa"
          cancelText="Hủy"
      />
    </div>
  );
}

export default Orders;
