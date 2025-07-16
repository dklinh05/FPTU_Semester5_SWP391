import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import {
  renderOrdersByShipperId,
  updateStatusOrder,
} from "../../services/orderService";
import { formatDate } from "../../utils/formatDate";
import PaginationTab from "../../components/PaginationTab/PaginationTab";

function OrderShipping() {
  const { userId } = useUser();
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  const [currentPage, setCurrentPage] = useState(1); // trang đang xem (1-based)
  const pageSize = 10; // số dòng mỗi trang
  const [totalItems, setTotalItems] = useState(0); // tổng số đơn hàng
  const [totalPages, setTotalPages] = useState(0);

  const getOrders = async () => {
    try {
      const response = await renderOrdersByShipperId(
        userId,
        status,
        currentPage - 1,
        pageSize
      );
      setOrders(response.content);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await updateStatusOrder(
        orderId,
        newStatus,
        null,
        userId
      );
      toast.success(response);
      await getOrders();
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    if (userId) getOrders();
  }, [userId, location.search, currentPage, pageSize]);
  
  return (
    <div className="product-section px-0 px-md-0 px-lg-3 mt-5">
      {/* Header */}
      <div className="card shadow-sm border-0 border-radius-12 mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center mb-3">
            <div className="col-6 col-md-auto d-flex align-items-center">
              <h5 className="fw-bold text-start">Order List</h5>
            </div>

            <div className="col-6 col-md ms-auto d-flex justify-content-end flex-wrap gap-2">
              {/* Filter Dropdown */}
              <div className="dropdown">
                <a
                  className="nav-link custom-bg-primary text-white rounded px-3 py-2"
                  href="#"
                  id="FilterMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Filter By <i className="fas fa-filter"></i>
                </a>
                <ul className="dropdown-menu" aria-labelledby="FilterMenuLink">
                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to={"/order-manage-shipping"}
                    >
                      All
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to={"/order-manage-shipping?status=Completed"}
                    >
                      Completed
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to={"/order-manage-shipping?status=Delivered"}
                    >
                      Delivered
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to={"/order-manage-shipping?status=Processing"}
                    >
                      Processing
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to={"/order-manage-shipping?status=Cancel"}
                    >
                      Cancel
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col" className="py-3">
                    Invoice No
                  </th>
                  <th scope="col" className="py-3">
                    Customer Name
                  </th>

                  <th scope="col" className="py-3">
                    Amount
                  </th>
                  <th scope="col" className="py-3">
                    Order Time
                  </th>
                  <th scope="col" className="py-3">
                    Status
                  </th>
                  <th scope="col" className="py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.orderID}</td>
                    <td>{order.customerName}</td>
                    <td>{order.totalAmount}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          order.status === "Delivered"
                            ? "status-success"
                            : order.status === "Cancel"
                            ? "status-danger"
                            : order.status === "Processing"
                            ? "status-info"
                            : "status-warning"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="d-flex justify-content-between">
                      <div className="mb-2 w-75">
                        {order.status === "WAITING" && (
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() =>
                              handleStatusChange(order.orderID, "DELIVERED")
                            }
                          >
                            Mark as Delivered
                          </button>
                        )}

                        {order.status === "DELIVERED" && (
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() =>
                              handleStatusChange(order.orderID, "COMPLETED")
                            }
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                      <div className="dropdown w-25">
                        <a
                          className="nav-link px-3 pt-1 pb-2"
                          href="#"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            <a
                              className="dropdown-item py-2"
                              href={`/shipper/order-detail/${order.orderID}`}
                            >
                              View
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item py-2"
                              href="invoice.html"
                            >
                              Invoice
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <PaginationTab
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderShipping;
