import { useEffect, useState } from "react";
import { Button, Card, Spinner, Badge } from "react-bootstrap";
import { useUser } from "../../context/UserContext";
import Header from "../../components/Header";
import ShopBanner from "../../layouts/components/ShopBanner";
import {
  renderOrderByBuyerId,
  renderOrderItemsByOrderId,
} from "../../services/orderService";

function ordersNotPayment() {
  const { userId } = useUser();
  const [orders, setOrders] = useState([]);
  const [orderItemsMap, setOrderItemsMap] = useState({});

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await renderOrderByBuyerId(userId);
      setOrders(fetchedOrders);

      // Fetch items for each order
      const itemsMap = {};
      for (const order of fetchedOrders) {
        const items = await renderOrderItemsByOrderId(order.orderID);
        itemsMap[order.orderID] = items;
      }
      setOrderItemsMap(itemsMap);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log(userId);
      fetchOrders();
    }
  }, [userId]);

  return (
    <div>
      <Header />
      <ShopBanner />
      <div className="container mt-4">
        {orders.map((order) => (
          <Card className="mb-4" key={order.orderID}>
            <Card.Header className="d-flex justify-content-between">
              <div>
                <strong>Đơn hàng #{order.orderID}</strong>
              </div>
              <Badge bg={order.status === "CANCELLED" ? "danger" : "success"}>
                {order.status}
              </Badge>
            </Card.Header>
            <Card.Body>
              {orderItemsMap[order.orderID]?.map((item) => (
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
                    <div className="text-muted">Số lượng: {item.quantity}</div>
                    <div className="text-muted">
                      Giá: ₫{item.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-end">
                <strong>
                  Tổng tiền: ₫{order.totalAmount.toLocaleString()}
                </strong>
              </div>
            </Card.Body>
            <Card.Footer className="text-end">
              <Button variant="outline-primary" className="me-2">
                Chi tiết
              </Button>
              <Button variant="danger">Mua lại</Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ordersNotPayment;
