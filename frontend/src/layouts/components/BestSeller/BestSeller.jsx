import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BestSellerItem from "../BestSellerItem";
import { renderBestSellerProduct } from "../../../services/productService";

function BestSeller() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await renderBestSellerProduct();
        setProducts(response.content);
        console.log("Response:", response.content);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <h1 className="display-4">Bestseller Products</h1>
          <p>
            Latin words, combined with a handful of model sentence structures,
            to generate Lorem Ipsum which looks reasonable.
          </p>
        </div>
        <div className="row g-4">
          {products.map((product, index) => (
            
              <BestSellerItem
                key={index}
                id={product.productID}
                img={product.imageURL}
                title={product.name}
                price={product.price}
                unit={product.unit}
              />
            
          ))}
        </div>
      </div>
    </div>
  );
}

export default BestSeller;
