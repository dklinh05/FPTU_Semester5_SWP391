import { useParams } from "react-router-dom";
import { useEffect, useState, cloneElement } from "react";
import Header from "../../components/Header";
import ShopBanner from "../components/ShopBanner";
import SidebarDetail from "../../components/SidebarDetail";
import Footer from "../../components/Footer";
import { renderProductById, getBestSellersByShop } from "../../services/productService";

function ProductLayout({ children }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        renderProductById(id)
            .then((data) => {
                setProduct(data);
                if (data?.supplier?.userID) {
                    getBestSellersByShop(data.supplier.userID)
                        .then(setTopProducts)
                        .catch((err) =>
                            console.error("Lỗi khi lấy sản phẩm của shop:", err)
                        );
                }
            })
            .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
    }, [id]);

    if (!product) return <p>Đang tải...</p>;

    return (
        <div>
            <Header />
            <ShopBanner name={product.supplier.businessName} id={product.supplier.userID} />
            <div className="container-fluid py-5 mt-5">
                <div className="container py-5">
                    <div className="row g-4 mb-5">
                        {/* Main Content Area */}
                        <div className="col-lg-8 col-xl-9">
                            <div className="row g-4">
                                {cloneElement(children, { product })}
                            </div>
                        </div>

                        {/* Sidebar Area */}
                        <div className="col-lg-4 col-xl-3">
                            <SidebarDetail
                                supplier={product.supplier}
                                topProducts={topProducts}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProductLayout;
