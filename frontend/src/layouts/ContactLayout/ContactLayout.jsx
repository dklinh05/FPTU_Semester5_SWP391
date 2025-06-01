import Header from "../../components/Header";
import ContactBanner from "../components/ContactBanner";
import ShopHero from "../components/ShopHero";
import SidebarDetail from "../../components/SidebarDetail";
import Footer from "../../components/Footer";

function ContactLayout({ children }) {
  return (
    <div>
      {/* <Spinner/> */}
      <Header />
      <ContactBanner />
      <div className="row g-4">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default ContactLayout;