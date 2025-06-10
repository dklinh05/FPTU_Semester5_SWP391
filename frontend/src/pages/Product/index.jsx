import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { renderProductById } from "../../services/productService";

function Product({product}) {
  // const { id } = useParams(); // <-- lấy id từ URL
  // const [product, setProduct] = useState(null);

  // useEffect(() => {
  //   renderProductById(id)
  //     .then((data) => setProduct(data))
  //     .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
  // }, [id]);

  // if (!product) return <p>Đang tải...</p>;

  return (
    <>
      <div className="col-lg-6">
        <div className="border rounded">
          <a href="#">
            <img
              src={product.imageURL ? product.imageURL : "img/single-item.jpg"}
              className="img-fluid rounded"
              alt="Image"
            />
          </a>
        </div>
      </div>
      <div className="col-lg-6">
        <h4 className="fw-bold mb-3">{product.name}</h4>
        <p className="mb-3">Category: {product.category}</p>
        <h5 className="fw-bold mb-3">{product.price} $</h5>
        <div className="d-flex mb-4">
          <i className="fa fa-star text-secondary"></i>
          <i className="fa fa-star text-secondary"></i>
          <i className="fa fa-star text-secondary"></i>
          <i className="fa fa-star text-secondary"></i>
          <i className="fa fa-star"></i>
        </div>
        <p className="mb-4">{product.description}</p>
        <p className="mb-4">{product.description}</p>
        <div className="input-group quantity mb-5" style={{ width: "100px" }}>
          <div className="input-group-btn">
            <button className="btn btn-sm btn-minus rounded-circle bg-light border">
              <i className="fa fa-minus"></i>
            </button>
          </div>
          <input
            type="text"
            className="form-control form-control-sm text-center border-0"
            defaultValue="1"
          />
          <div className="input-group-btn">
            <button className="btn btn-sm btn-plus rounded-circle bg-light border">
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
        <a
          href="#"
          className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
        >
          <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
        </a>
      </div>
    </>
  );
}

export default Product;
