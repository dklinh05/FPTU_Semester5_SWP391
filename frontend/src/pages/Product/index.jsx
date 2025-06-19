import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { addProductToCart } from "../../services/cartItemService";

function Product({ product }) {
  const { userId } = useUser();
  const { setReload } = useCart();
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);

  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Không cho nhỏ hơn 1

  const handleChangeInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productData = new FormData();

    productData.append("buyerId", userId);
    productData.append("productId", product.productID);
    productData.append("quantity", quantity);

    try {
      const response = await addProductToCart(productData);
      setReload((prev) => !prev);
      alert("Done");
      console.log("Response:", response);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

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
            <button
              className="btn btn-sm btn-minus rounded-circle bg-light border"
              onClick={decreaseQuantity}
            >
              <i className="fa fa-minus"></i>
            </button>
          </div>
          <input
            type="text"
            className="form-control form-control-sm text-center border-0"
            value={quantity}
            onChange={handleChangeInput}
          />
          <div className="input-group-btn">
            <button
              className="btn btn-sm btn-plus rounded-circle bg-light border"
              onClick={increaseQuantity}
            >
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
        <div
          className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
          onClick={handleAddToCart}
        >
          <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
        </div>
      </div>
    </>
  );
}

export default Product;
