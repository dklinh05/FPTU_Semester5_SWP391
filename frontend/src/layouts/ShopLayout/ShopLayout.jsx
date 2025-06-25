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
  const [sortValue, setSortValue] = useState("createdAt");

   const [currentPage, setCurrentPage] = useState(1); // trang đang xem (1-based)
  const pageSize = 8; // số dòng mỗi trang
  const [totalItems, setTotalItems] = useState(0); // tổng số đơn hàng
  const [totalPages, setTotalPages] = useState(0);

  const getProducts = async (sortBy) => {
    try {
      const response = await renderProductBySupplierId(id, sortBy, null, currentPage-1, pageSize);
      setProducts(response.content);
      setTotalPages(response.totalPages);
        setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    getProducts(sortValue);
  }, [sortValue,currentPage, pageSize, location.search]);

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
                    <SidebarDetail />
                  </div>
                </div>
                {cloneElement(children, { products })}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
              <div>
                Showing {currentPage}- {totalPages} of {totalItems}
              </div>
              <ul className="pagination">
                {/* Previous button */}
                <li className={currentPage === 1 ? "disabled" : ""}>
                  <button
                    className="pagination-link"
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                  >
                    &lt;
                  </button>
                </li>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <li key={pageNum}>
                      <button
                        className={`pagination-link ${
                          pageNum === currentPage ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  )
                )}

                {/* Next button */}
                <li className={currentPage === totalPages ? "disabled" : ""}>
                  <button
                    className="pagination-link"
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                  >
                    &gt;
                  </button>
                </li>
              </ul>
            </div>
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
