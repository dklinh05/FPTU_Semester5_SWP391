import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import Header from "../../components/Header";
import Hero from "../components/Hero";
import FeatureSection from "../components/FeatureSection";
import ShopStart from "../components/ShopStart";
import BestSeller from "../components/BestSeller/BestSeller";
import Footer from "../../components/Footer";
import CommunityChatBanner from "../components/CommunityChatBanner";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  return (
    <div className={cx("wrapper")}>
      {/* <Spinner/> */}
      <Header />
      <Hero />
      <CommunityChatBanner/>
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
