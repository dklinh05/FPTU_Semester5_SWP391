import { useParams } from "react-router-dom";
import { useEffect, useState, cloneElement } from "react";
import Header from "../../components/Header";
import ShopBanner from "../components/ShopBanner";
import ShopHero from "../components/ShopHero";
import SidebarDetail from "../../components/SidebarDetail";
import PaginationTab from "../../components/PaginationTab/PaginationTab";
import Footer from "../../components/Footer";
import { renderProductBySupplierId, getBestSellersByShop } from "../../services/productService";

function ShopLayout({ children }) {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [sortValue, setSortValue] = useState("createdAt");

  const [currentPage, setCurrentPage] = useState(1); // trang đang xem (1-based)
  const pageSize = 8; // số dòng mỗi trang
  const [totalItems, setTotalItems] = useState(0); // tổng số đơn hàng
  const [totalPages, setTotalPages] = useState(0);

  const getProducts = async (sortBy) => {
    try {
      const response = await renderProductBySupplierId(
        id,
        "active",
        sortBy,
        null,
        currentPage - 1,
        pageSize
      );
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const getShopSidebarProps = async ()=>{
       try {
      const response =await getBestSellersByShop(id);
      setTopProducts(response);
     
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  }

  useEffect(() => {
    getProducts(sortValue);
    getShopSidebarProps();
  }, [sortValue, currentPage, pageSize, location.search]);

  return (
    <div>
      <Header />
      <ShopBanner name={products[0]?.supplier?.businessName || "Shop"} />
      <div className="container-fluid fruite py-5">
        <div className="container py-5">
          <h1 className="mb-4">Fresh fruits shop</h1>
          <div className="row g-4">
            <div className="col-lg-12">
              <ShopHero sortValue={sortValue} setSortValue={setSortValue} />
              <div className="row g-4">
                <div className="col-lg-3">
                  <div className="row g-4">
                    <SidebarDetail supplier={products[0].supplier} topProducts={topProducts}/>
                  </div>
                </div>
                {cloneElement(children, { products })}

                <PaginationTab
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  setCurrentPage={setCurrentPage}
                />
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
