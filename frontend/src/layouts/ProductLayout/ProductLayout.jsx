import { useParams } from "react-router-dom";
import { useEffect, useState, cloneElement } from "react";
import Header from "../../components/Header";
import ShopBanner from "../components/ShopBanner";
import SidebarDetail from "../../components/SidebarDetail";
import Footer from "../../components/Footer";
import { renderProductById } from "../../services/productService";

function ProductLayout({ children }) {
  const { id } = useParams(); // <-- lấy id từ URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    renderProductById(id)
      .then((data) => setProduct(data))
      .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
  }, [id]);

  if (!product) return <p>Đang tải...</p>;

  return (
    <div>
      {/* <Spinner/> */}
      <Header />
      <ShopBanner name={product.supplier.businessName} id={product.supplier.userID} />
      <div className="container-fluid py-5 mt-5">
        <div className="container py-5">
          <div className="row g-4 mb-5">
            <div className="col-lg-8 col-xl-9">
              <div className="row g-4">
                {cloneElement(children, { product })}
              </div>
            </div>

            {/*<div className="col-lg-4 col-xl-3">*/}
            {/*  <div className="row g-4 fruite">*/}
            {/*    <SidebarDetail>*/}
            {/*    </SidebarDetail>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductLayout;
