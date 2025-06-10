import { useParams } from "react-router-dom";
import { useEffect, useState, cloneElement } from "react";
import Header from "../../components/Header";
import ShopBanner from "../components/ShopBanner";
import ShopHero from "../components/ShopHero";
import SidebarDetail from "../../components/SidebarDetail";
import Footer from "../../components/Footer";
import { renderProductBySupplierId } from "../../services/productService";

function ShopLayout({ children }) {

  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await renderProductBySupplierId(id);
        setProducts(response);
        console.log("Response:", response);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    getProducts();
  }, []);
  return (
    <div>
      <Header />
     <ShopBanner name={products[0]?.supplier?.fullName || "Shop"} />
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
                {cloneElement(children, { products })}
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
