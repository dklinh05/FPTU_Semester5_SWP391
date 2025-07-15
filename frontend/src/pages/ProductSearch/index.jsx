import React, { useEffect, useState, useMemo } from "react";
import {
  searchProducts,
  renderProductByCategory,
} from "../../services/productService";
import { useLocation as useCustomLocation } from "../../context/LocationContext";
import { useLocation as useRouterLocation, useNavigate, Link } from "react-router-dom";
import styles from "./ProductSearch.module.scss";
import CardItem from "../../components/CardItem";
import PaginationTab from "../../components/PaginationTab/PaginationTab";
import LocationDropdown from "../../components/LocationDropdown";

const ProductSearch = () => {
  const location = useRouterLocation();
  const navigate = useNavigate(); // ✅ Thêm dòng này
  const {
    currentLocation,
    selectedDistrict,
    setSelectedDistrict,
    selectedLocation,
    setSelectedLocation,
    currentDistrict,
  } = useCustomLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const searchParams = useMemo(
      () => new URLSearchParams(location.search),
      [location.search]
  );

  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const rating = searchParams.get("rating");
  const latest = searchParams.get("latest");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!keyword && !category && !rating) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const response = await renderProductByCategory(
          keyword,
          category,
          selectedLocation?.lat,
          selectedLocation?.lng,
          rating,
          latest,
          currentPage - 1,
          pageSize
      );
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalElements);
    } catch (error) {
      setProducts([]);
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, location.search, currentPage, pageSize, selectedLocation]);

  return (
      <div className={`${styles["product-search"]}`}>
        <LocationDropdown
            currentDistrict={currentDistrict}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            setCurrentPage={setCurrentPage}
            currentLocation={currentLocation}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
        />
        <h5>Kết quả tìm kiếm cho: "{keyword}"</h5>
        {loading ? (
            <p>Loading...</p>
        ) : products.length === 0 ? (
            <div className="text-center mt-5">
              <img
                  src="/public/img/no_result.png"
                  alt="No results"
                  className="mb-3"
                  style={{ width: "100px" }}
              />
              <p className="text-danger">Không tìm thấy sản phẩm nào.</p>
              <button
                  className="btn btn-danger mt-3"
                  onClick={() => {
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.delete("category");
                    searchParams.delete("rating");
                    searchParams.delete("latest");
                    navigate(`?${searchParams.toString()}`, { replace: true });
                    setCurrentPage(1);
                  }}
              >
                Reset Filters
              </button>
            </div>
        ) : (
            <div className="tab-content">
              <div id="tab-1" className="tab-pane fade show p-0 active">
                <div className="row g-4">
                  <div className="col-lg-12">
                    <div className="row g-4">
                      {products?.map((product) => (
                          <Link
                              key={product.productID}
                              to={`/product/${product.productID}`}
                              className="col-md-6 col-lg-4 col-xl-4"
                          >
                            <CardItem
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
                <PaginationTab
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
        )}
      </div>
  );
};

export default ProductSearch;
