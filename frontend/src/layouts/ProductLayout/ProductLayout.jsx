import Header from "../../components/Header";
import ShopBanner from "../components/ShopBanner";
import SearchDetail from "../../components/SearchDetail";
import SidebarDetail from "../../components/SidebarDetail";
import Footer from "../../components/Footer";

function ProductLayout({ children }) {
  return (
    <div>
      {/* <Spinner/> */}
      <Header />
      <ShopBanner />
      <div className="container-fluid py-5 mt-5">
        <div className="container py-5">
          <div className="row g-4 mb-5">
            <div className="col-lg-8 col-xl-9">
              <div className="row g-4">{children}</div>
            </div>

            <div className="col-lg-4 col-xl-3">
              <div className="row g-4 fruite">
                <SidebarDetail>
                  <SearchDetail />
                </SidebarDetail>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductLayout;
