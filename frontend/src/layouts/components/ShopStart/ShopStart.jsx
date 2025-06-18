import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardItem from "../../../components/CardItem/CardItem";
import {
  renderProduct,
  renderProductByCategory,
} from "../../../services/productService";

function ShopStart() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await renderProductByCategory(category);
        setProducts(response.content);
        console.log("Response:", response.content);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    getProducts();
  }, [category]);

  return (
    <div className="container-fluid fruite py-5">
      <div className="container py-5">
        <div className="tab-class text-center">
          <div className="row g-4">
            <div className="col-lg-4 text-start">
              <h1>Our Organic Products</h1>
            </div>
            <div className="col-lg-8 text-end">
              <ul className="nav nav-pills d-inline-flex text-center mb-5">
                <li className="nav-item">
                  <div
                    className="d-flex m-2 py-2 bg-light rounded-pill active"
                    data-bs-toggle="pill"
                     onClick={() => setCategory("")}
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      All Products
                    </span>
                  </div>
                </li>
                <li className="nav-item">
                  <div
                    className="d-flex py-2 m-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    onClick={() => setCategory("Rau")}
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Rau
                    </span>
                  </div>
                </li>
                <li className="nav-item">
                  <div
                    className="d-flex m-2 py-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    onClick={() => setCategory("Củ, quả")}
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Củ, quả
                    </span>
                  </div>
                </li>
                <li className="nav-item">
                  <div
                    className="d-flex m-2 py-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    onClick={() => setCategory("Trái cây")}
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Trái cây
                    </span>
                  </div>
                </li>
                <li className="nav-item">
                  <div
                    className="d-flex m-2 py-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    onClick={() => setCategory("Thực phẩm")}
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Thực phẩm
                    </span>
                  </div>
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
                          shopName={product.supplier.fullName}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div id="tab-2" className="tab-pane fade show p-0"></div>
            <div id="tab-3" className="tab-pane fade show p-0"></div>
            <div id="tab-4" className="tab-pane fade show p-0"></div>
            <div id="tab-5" className="tab-pane fade show p-0"></div>

            {/* Các tab khác (tab-2, tab-3...) có thể thêm tương tự ở đây */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopStart;
