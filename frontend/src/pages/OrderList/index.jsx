import React, { useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([
    {
      invoiceNo: "#12598",
      customerName: "John Doe",
      method: "Cash",
      amount: "$4,099",
      orderTime: "24 Nov, 2024 3:59 PM",
      status: "Delivered",
    },
    {
      invoiceNo: "#12599",
      customerName: "Jane Smith",
      method: "Credit Card",
      amount: "$2,499",
      orderTime: "24 Nov, 2024 3:45 PM",
      status: "Cancel",
    },
    {
      invoiceNo: "#12600",
      customerName: "Alice Johnson",
      method: "PayPal",
      amount: "$3,299",
      orderTime: "24 Nov, 2024 2:30 PM",
      status: "Processing",
    },
    {
      invoiceNo: "#12601",
      customerName: "Bob Brown",
      method: "Cash",
      amount: "$1,999",
      orderTime: "24 Nov, 2024 1:15 PM",
      status: "Pending",
    },
  ]);

  const handleStatusChange = (index, newStatus) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = newStatus;
    setOrders(updatedOrders);
  };

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
                    <a className="dropdown-item py-2" href="#">
                      Pending
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-2" href="#">
                      Delivered
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-2" href="#">
                      Processing
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-2" href="#">
                      Cancel
                    </a>
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
                  <th scope="col" className="py-3">Invoice No</th>
                  <th scope="col" className="py-3">Customer Name</th>
                  <th scope="col" className="py-3">Method</th>
                  <th scope="col" className="py-3">Amount</th>
                  <th scope="col" className="py-3">Order Time</th>
                  <th scope="col" className="py-3">Status</th>
                  <th scope="col" className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.invoiceNo}</td>
                    <td>{order.customerName}</td>
                    <td>{order.method}</td>
                    <td>{order.amount}</td>
                    <td>{order.orderTime}</td>
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
                        <select
                          className="form-select form-select-sm border bg-light text-secondary rounded"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(index, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Processing">Processing</option>
                          <option value="Cancel">Cancel</option>
                        </select>
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
                            <a className="dropdown-item py-2" href="#">
                              View
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item py-2" href="invoice.html">
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
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
            <div>
              <p className="text-center text-md-start">Showing 1 - 20 of 121</p>
            </div>
            <ul className="pagination">
              <li>
                <a href="#" className="pagination-link disabled" tabIndex="-1">
                  {/* < */}
                </a>
              </li>
              <li>
                <a href="#" className="pagination-link active">
                  1
                </a>
              </li>
              <li>
                <a href="#" className="pagination-link">
                  2
                </a>
              </li>
              <li>
                <a href="#" className="pagination-link">
                  3
                </a>
              </li>
              <li>
                <a href="#" className="pagination-link">
                  4
                </a>
              </li>
              <li>
                <a href="#" className="pagination-link">
                  {/* > */}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;