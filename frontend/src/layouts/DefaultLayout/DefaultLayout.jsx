import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";
import ModalSearch from "../components/ModalSearch";
import Hero from "../components/Hero";
import FeatureSection from "../components/FeatureSection";
import ShopStart from "../components/ShopStart";
import BestSeller from "../components/BestSeller/BestSeller";
import Footer from "../../components/Footer";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  return (
    <div className={cx("wrapper")}>
      {/* <Spinner/> */}
      <Header />
      <ModalSearch />
      <Hero />
      <FeatureSection />
      <ShopStart />
      <BestSeller />
      <div className={cx("container")}>
        <div className={cx("content")}>{children}</div>
      </div>
      <Footer />
      {/* <Chatbot/> */}
    </div>
  );
}

export default DefaultLayout;
