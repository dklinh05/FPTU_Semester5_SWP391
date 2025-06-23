import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { addProductToCart } from "../../services/cartItemService";
import { getReviewsByProductId } from "../../services/feedbackService";

function Product({ product }) {
  const { userId } = useUser();
  const { setReload } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleChangeInput = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(!isNaN(value) && value > 0 ? value : 1);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productData = new FormData();
    productData.append("buyerId", userId);
    productData.append("productId", product.productID);
    productData.append("quantity", quantity);

    try {
      await addProductToCart(productData);
      setReload((prev) => !prev);
      alert("Done");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ:", error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByProductId(product.productID);
        setReviews(data);
      } catch (err) {
        console.error("Không thể load đánh giá:", err);
      }
    };

    if (product?.productID) fetchReviews();
  }, [product]);

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
        <i
            key={i}
            className={`fa fa-star${i < count ? " text-warning" : " text-secondary"}`}
        />
    ));
  };

  return (
      <>
        <div className="col-lg-6">
          <div className="border rounded">
            <img
                src={product.imageURL || "img/single-item.jpg"}
                className="img-fluid rounded"
                alt={product.name}
            />
          </div>
        </div>
        <div className="col-lg-6">
          <h4 className="fw-bold mb-3">{product.name}</h4>
          <p className="mb-3">Category: {product.category}</p>
          <h5 className="fw-bold mb-3">{product.price} $</h5>
          <div className="d-flex mb-4">{renderStars(4)}</div>
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

        {/* REVIEW SECTION */}
        <div className="col-12 mt-5">
          <h5 className="mb-4">Đánh giá sản phẩm</h5>
          {reviews.length === 0 ? (
              <p className="text-muted">Chưa có đánh giá nào.</p>
          ) : (
              reviews.map((rev, idx) => (
                  <div className="border rounded p-3 mb-3" key={idx}>
                    <div className="mb-2">
                      <strong>Chất lượng sản phẩm: </strong>
                      {renderStars(rev.productQuality)}
                    </div>
                    <div className="mb-2">
                      <strong>Dịch vụ người bán: </strong>
                      {renderStars(rev.sellerService)}
                    </div>
                    <div className="mb-2">
                      <strong>Tốc độ giao hàng: </strong>
                      {renderStars(rev.deliverySpeed)}
                    </div>
                    {rev.comment && <p className="mb-2">📝 {rev.comment}</p>}
                    {rev.images && rev.images.length > 0 && (
                        <div className="d-flex gap-2">
                          {rev.images.map((img, i) => (
                              <img
                                  key={i}
                                  src={img}
                                  alt={`review-img-${i}`}
                                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }}
                              />
                          ))}
                        </div>
                    )}
                  </div>
              ))
          )}
        </div>
      </>
  );
}

export default Product;
