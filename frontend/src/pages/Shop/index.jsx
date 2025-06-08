import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { renderProductBySupplierId } from "../../services/productService";
import CardItem from "../../components/CardItem/CardItem";

function Shop() {
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
    <div className="col-lg-9">
      <div className="row g-4 justify-content-center">
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

        <div className="col-12">
          <div className="pagination d-flex justify-content-center mt-5">
            <a href="#" className="rounded">
              &laquo;
            </a>
            <a href="#" className="active rounded">
              1
            </a>
            <a href="#" className="rounded">
              2
            </a>
            <a href="#" className="rounded">
              3
            </a>
            <a href="#" className="rounded">
              4
            </a>
            <a href="#" className="rounded">
              5
            </a>
            <a href="#" className="rounded">
              6
            </a>
            <a href="#" className="rounded">
              &raquo;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
