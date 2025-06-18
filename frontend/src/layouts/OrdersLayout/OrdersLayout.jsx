import Header from "../../components/Header";
import ShopBanner from "../components/ShopBanner";
import OrderTabs from "../components/OrderTabs";

function OrdersLayout({ children }) {
  return (
    <>
      <Header />
      <ShopBanner />
      <OrderTabs />
      {children}
    </>
  );
}

export default OrdersLayout;
