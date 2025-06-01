import Header from "../../components/Header";
import ShopBanner from "../components/ShopBanner";
import ShopHero from "../components/ShopHero";
import SidebarDetail from "../../components/SidebarDetail";
import Footer from "../../components/Footer";

function ShopLayout({ children }) {
  return (
    <div>
      <Header />
      <ShopBanner />
      <div className="container-fluid fruite py-5">
        <div className="container py-5">
          <h1 className="mb-4">Fresh fruits shop</h1>
          <div className="row g-4">
            <div className="col-lg-12">
              <ShopHero />
              <div className="row g-4">
                <div className="col-lg-3">
                  <div className="row g-4">
                    <SidebarDetail />
                  </div>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ShopLayout;
