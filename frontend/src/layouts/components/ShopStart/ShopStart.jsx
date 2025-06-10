import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CardItem from "../../../components/CardItem/CardItem";
import { renderProduct } from "../../../services/productService";

function ShopStart() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await renderProduct();
        setProducts(response.content);
        console.log("Response:", response.content);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    getProducts();
  }, []);

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
                  <a
                    className="d-flex m-2 py-2 bg-light rounded-pill active"
                    data-bs-toggle="pill"
                    href="#tab-1"
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      All Products
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="d-flex py-2 m-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    href="#tab-2"
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Vegetables
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="d-flex m-2 py-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    href="#tab-3"
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Fruits
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="d-flex m-2 py-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    href="#tab-4"
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Bread
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="d-flex m-2 py-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    href="#tab-5"
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Meat
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
