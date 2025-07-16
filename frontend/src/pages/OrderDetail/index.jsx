import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { renderOrderById, renderOrderItemsByOrderId } from "../../services/orderService";
import { formatDate } from "../../utils/formatDate"; 

function OrderDetail() {
  const { userId } = useUser();
 const { id } = useParams();
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);

  const getOrders = async () => {
    try {
      const response = await renderOrderById(id);
      setOrder(response);
      console.log("Response:", response);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const getOrderItems = async () => {
    try {
      const response = await renderOrderItemsByOrderId(id);
      setOrderItems(response);
      console.log("Response:", response);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

useEffect(() => {
   if(userId) {
    getOrders();
    getOrderItems();
   }
  }, [userId]);

  return (
    <div className="product-section px-0 px-md-0 px-lg-3 mt-5">
      <div className="card shadow-sm border-0 border-radius-12 mb-4">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold">Order Details</h5>
            <span className="badge bg-secondary px-3 py-2">{order.status}</span>
          </div>

          {/* Order Info */}
          <div className="row mb-3">
            <div className="col-md-6">
              <p>
                <strong>Invoice No:</strong> {order.orderID}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {formatDate(order.orderDate)}
              </p>
              <p>
                {/* <strong>Payment Method:</strong> {order.method} */}
              </p>
              <p>
                <strong>Address:</strong>{order.address}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Buyer ID:</strong> {order.buyerId}
              </p>
              <p>
                <strong>Order Group:</strong> {order.orderGroupId || "N/A"}
              </p>
              <p>
                <strong>Total Amount:</strong>{" "}
                {order.totalAmount?.toLocaleString()} VND
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price?.toLocaleString()} VND</td>
                    <td>
                      {(item.quantity * item.price).toLocaleString()} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Action */}
          <div className="mt-4 d-flex justify-content-between align-items-center">
            <a href="/orderlist" className="btn btn-secondary">
              <i className="fas fa-arrow-left me-2"></i>Back to Order List
            </a>
            <a href={`/invoice/${order.orderID}`} className="btn btn-primary">
              View Invoice
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
