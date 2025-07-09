import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "../../../context/LocationContext";
import PaginationTab from "../../../components/PaginationTab/PaginationTab";
import CardItem from "../../../components/CardItem/CardItem";
import { renderProductByCategory } from "../../../services/productService";
import LocationDropdown from "../../../components/LocationDropdown";

function ShopStart() {
  const {
    currentLocation,
    selectedDistrict,
    setSelectedDistrict,
    selectedLocation,
    setSelectedLocation,
    currentDistrict,
  } = useLocation();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1); // trang đang xem (1-based)
  const pageSize = 12; // số dòng mỗi trang
  const [totalItems, setTotalItems] = useState(0); // tổng số đơn hàng
  const [totalPages, setTotalPages] = useState(0);

  const getProducts = async () => {
    try {
      const response = await renderProductByCategory(
        null,
        category,
        selectedLocation?.lat,
        selectedLocation?.lng,
        null,
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

  useEffect(() => {
    getProducts();
  }, [category, currentPage, pageSize, selectedLocation]);

  return (
    <div className="container-fluid fruite py-5">
      <div className="container py-5">
        <div className="tab-class text-center">
          <LocationDropdown
            currentDistrict={currentDistrict}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            setCurrentPage={setCurrentPage}
            currentLocation={currentLocation}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />

          <div className="row g-4">
            <div className="col-lg-4 text-start">
              <h1>Our Organic Products</h1>
            </div>
            <div className="col-lg-8 text-end">
              <ul className="nav nav-pills d-inline-flex text-center mb-5">
                <li className="nav-item">
                  <a
                    className={`d-flex m-2 py-2 bg-light rounded-pill ${
                      category === "" ? "active" : ""
                    }`}
                    data-bs-toggle="pill"
                    onClick={() => setCategory("")}
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      All Products
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`d-flex m-2 py-2 bg-light rounded-pill ${
                      category === "Rau" ? "active" : ""
                    }`}
                    data-bs-toggle="pill"
                    onClick={() => setCategory("Rau")}
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Rau
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`d-flex m-2 py-2 bg-light rounded-pill ${
                      category === "Củ, quả" ? "active" : ""
                    }`}
                    data-bs-toggle="pill"
                    onClick={() => setCategory("Củ, quả")}
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Củ, quả
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`d-flex m-2 py-2 bg-light rounded-pill ${
                      category === "Trái cây" ? "active" : ""
                    }`}
                    data-bs-toggle="pill"
                    onClick={() => setCategory("Trái cây")}
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Trái cây
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`d-flex m-2 py-2 bg-light rounded-pill ${
                      category === "Thực phẩm" ? "active" : ""
                    }`}
                    data-bs-toggle="pill"
                    onClick={() => setCategory("Thực phẩm")}
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Thực phẩm
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <div className="row g-4">
                <div className="col-lg-12">
                  <div className="row g-4">
                    {products?.map((product, index) => (
                      <Link
                        to={`/product/${product.productID}`}
                        className="col-md-6 col-lg-4 col-xl-3"
                      >
                        <CardItem
                          key={index}
                          id={product.productID}
                          img={product.imageURL}
                          category={product.category}
                          title={product.name}
                          description={product.description}
                          price={product.price}
                          unit={product.unit}
                          shopName={product.supplier.businessName}
                          soldCount={product.sales}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Pagination */}
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
  );
}

export default ShopStart;
