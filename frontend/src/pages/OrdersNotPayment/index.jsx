import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, Spinner, Badge } from "react-bootstrap";
import { useUser } from "../../context/UserContext";
import {
  cancelOrder,
  renderOrderItemsByOrderId,
  renderOrderGroupByBuyerId,
  renderOrdersByOrderGroupId,
} from "../../services/orderService";
import { createPayment } from "../../services/paymentService";

function OrdersNotPayment() {
  const { userId } = useUser();
  const [cancelTrigger, setCancelTrigger] = useState(0);
  const [orderGroupsData, setOrderGroupsData] = useState([]);

  const fetchOrders = async () => {
    try {
      const fetchedOrderGroups = await renderOrderGroupByBuyerId(userId);

      const orderGroupsWithOrders = await Promise.all(
        fetchedOrderGroups.map(async (group) => {
          const orders = await renderOrdersByOrderGroupId(group.orderGroupID);

          const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
              const items = await renderOrderItemsByOrderId(order.orderID);
              return { ...order, items };
            })
          );

          return { ...group, orders: ordersWithItems };
        })
      );

      setOrderGroupsData(orderGroupsWithOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const handlePayment = async (amount, groupId) => {
    try {
      const response = await createPayment(amount, groupId);
      window.location.href = response.redirectUrl;
      console.log("Response:", response);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const handleCancelOrder = async (id) => {
  try {
    const response = await cancelOrder(id);
    toast.success(response);
    setCancelTrigger(prev => prev + 1);  // Tăng để đảm bảo luôn thay đổi
  } catch (error) {
    console.error("Lỗi khi huỷ đơn hàng:", error);
  }
};

useEffect(() => {
  if (userId) {
    fetchOrders();
  }
}, [userId, cancelTrigger]);

  return (
    <div className="container mt-4">
      {orderGroupsData.map((group) => (
        <Card className="mb-5" key={group.orderGroupID}>
          <Card.Header className="bg-dark text-white">
            <strong>Order Group #{group.orderGroupID}</strong> – Tổng tiền: ₫
            {group.finalAmount.toLocaleString()}
          </Card.Header>

          {group.orders.map((order) => (
            <Card className="m-3" key={order.orderID}>
              <Card.Header className="d-flex justify-content-between">
                <div>
                  <strong>Đơn hàng từ {order.supplierName}</strong>
                </div>
                <Badge bg={order.status === "CANCELLED" ? "danger" : "success"}>
                  {order.status}
                </Badge>
              </Card.Header>
              <Card.Body>
                {order.items.map((item) => (
                  <div className="d-flex mb-3" key={item.orderItemID}>
                    <img
                      src={
                        item.productImage || "https://via.placeholder.com/60"
                      }
                      alt="item"
                      width={60}
                      height={60}
                      className="me-3"
                    />
                    <div>
                      <div>
                        <strong>{item.productName}</strong>
                      </div>
                      <div className="text-muted">
                        Số lượng: {item.quantity}
                      </div>
                      <div className="text-muted">
                        Giá: ₫{item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-end">
                  <strong>
                    Tổng đơn: ₫{order.totalAmount.toLocaleString()}
                  </strong>
                </div>
              </Card.Body>
            </Card>
          ))}
          <Card.Footer className="text-end">
            <Button variant="outline-primary" className="me-2">
              Chi tiết
            </Button>
            <Button
              variant="primary"
              className="me-2"
              onClick={() => handleCancelOrder(group.orderGroupID)}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                handlePayment(group.finalAmount, group.orderGroupID)
              }
            >
              Thanh toán
            </Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
}

export default OrdersNotPayment;
