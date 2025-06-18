import { useEffect, useState } from "react";
import { Button, Card, Spinner, Badge } from "react-bootstrap";
import { useUser } from "../../context/UserContext";
import {
  renderOrderByBuyerId,
  renderOrderItemsByOrderId,
  renderOrderGroupByBuyerId,
  renderOrdersByOrderGroupId,
} from "../../services/orderService";

function OrdersNotPayment() {
  const { userId } = useUser();
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

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

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
                  <Badge
                    bg={order.status === "CANCELLED" ? "danger" : "success"}
                  >
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
                <Card.Footer className="text-end">
                  <Button variant="outline-primary" className="me-2">
                    Chi tiết
                  </Button>
                  <Button variant="danger">Thanh toán</Button>
                </Card.Footer>
              </Card>
            ))}
          </Card>
        ))}
      </div>
 
  );
}

export default OrdersNotPayment;
