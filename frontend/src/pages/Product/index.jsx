import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { addProductToCart } from "../../services/cartItemService";
import { getReviewsByProductId } from "../../services/feedbackService";
import "/src/components/SidebarDetail/SideBarDetail.module.scss";

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
    const productData = new FormData();
    productData.append("buyerId", userId);
    productData.append("productId", product.productID);
    productData.append("quantity", quantity);

    try {
      await addProductToCart(productData);
      setReload((prev) => !prev);
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByProductId(product.productID);
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };
    if (product?.productID) fetchReviews();
  }, [product]);

  const renderStars = (avg = 0) => {
    return [...Array(5)].map((_, i) => {
      const fill =
          i + 1 <= avg
              ? 100
              : i < avg
                  ? Math.round((avg - i) * 100)
                  : 0;

      return (
          <div
              key={i}
              style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                background: `linear-gradient(90deg, #ffc107 ${fill}%, #e4e5e9 ${fill}%)`,
                WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 576 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fill=\'white\' d=\'M287.9 17.8L354 150.2l144.5 21.1c26.2 3.8 36.7 36 17.7 54.6L439 345.6 459 490c4.5 26.3-23 46-46.4 33.7L288 439.6 163.4 523.7c-23.4 12.2-50.9-7.4-46.4-33.7l20-144.4L59.9 226c-19-18.6-8.5-50.8 17.7-54.6L222 150.2 288.1 17.8c11.7-23.6 45.6-23.9 57.3 0z\'/%3E%3C/svg%3E")',
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "cover",
                marginRight: "2px"
              }}
          ></div>
      );
    });
  };

  const getAverageRating = () => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => {
      const avg = (r.productQuality + r.sellerService + r.deliverySpeed) / 3;
      return sum + avg;
    }, 0);
    return total / reviews.length;
  };

  const average = getAverageRating();

  return (
      <>
        {/* Product Image and Details */}
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
          <h5 className="fw-bold mb-3">
            {product.price} VND / {product.unit}
          </h5>
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

          <div>
            <button
                className="btn btn-success btn-sm px-4 rounded-pill"
                onClick={() => {
                  window.location.href = `#`;
                }}
            >
              Chat with Supplier
            </button>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="product-ratings-section col-12 mt-5">
          <h3 className="fw-bold">Product Ratings</h3>
          <div className="p-4 rounded bg-light border mb-3">
            <h4 className="fw-bold mb-2 text-danger">
              {average.toFixed(1)} out of 5
            </h4>
            <div className="d-flex mb-3">{renderStars(average)}</div>

            <div className="d-flex flex-wrap gap-2">
              {["All", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star", "With Comments", "With Media"].map(
                  (label, i) => (
                      <button key={i} className="btn btn-sm border text-warning px-3 rounded-pill">
                        {label}
                      </button>
                  )
              )}
            </div>
          </div>

          {reviews.length === 0 ? (
              <p className="text-muted">Chưa có đánh giá nào.</p>
          ) : (
              reviews.map((rev, idx) => {
                const avg = (rev.productQuality + rev.sellerService + rev.deliverySpeed) / 3;
                const username = rev.buyerUsername || "Người dùng";
                const maskedUsername =
                    username.length <= 2
                        ? username
                        : username[0] + "*".repeat(username.length - 2) + username[username.length - 1];

                return (
                    <div className="border rounded p-3 mb-3" key={idx}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="fw-bold">{maskedUsername}</div>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        {renderStars(avg)}
                        <span className="text-muted small">({avg.toFixed(1)})</span>
                      </div>
                      {rev.comment && <p className="mb-2">{rev.comment}</p>}
                      {rev.imageList?.length > 0 && (
                          <div className="d-flex gap-2 mt-2">
                            {rev.imageList.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`review-${i}`}
                                    style={{
                                      width: 80,
                                      height: 80,
                                      objectFit: "cover",
                                      borderRadius: 6,
                                    }}
                                />
                            ))}
                          </div>
                      )}
                    </div>
                );
              })
          )}
        </div>
      </>
  );
}

export default Product;
