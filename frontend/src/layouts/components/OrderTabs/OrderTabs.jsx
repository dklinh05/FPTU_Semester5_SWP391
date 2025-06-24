import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { label: "Tất cả", path: "/orders" },
  { label: "Chờ thanh toán", path: "/orders/pending" },
  { label: "Vận chuyển", path: "/orders?status=delivered" },
  { label: "Chờ giao hàng", path: "/orders?status=PAID" },
  { label: "Hoàn thành", path: "/orders?status=completed" },
  { label: "Đã hủy", path: "/orders?status=cancelled" },
  { label: "Trả hàng/Hoàn tiền", path: "/orders?status=returns" },
];

const OrderTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center">
      <ul className="nav nav-tabs">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.path}>
            <button
              className={`nav-link ${
                (location.pathname + location.search) === tab.path
                  ? "active text-danger border-danger"
                  : ""
              }`}
              onClick={() => navigate(tab.path)}
              style={{ background: "transparent", border: "none" }}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderTabs;
