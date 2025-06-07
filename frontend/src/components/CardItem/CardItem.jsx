import { addProductToCart } from "../../services/cartItemService";

function CardItem({ id, category, title, description, price, img }) {
  const userId = localStorage.getItem("user");
  const addToCart = async () => {
    const productData = new FormData();

    productData.append("buyerId", userId);
    productData.append("productId", id);
    try {
      const response = await addProductToCart(productData);
      alert("Done");
      console.log("Response:", response);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  return (
    <div className="rounded position-relative fruite-item">
      <div className="fruite-img" style={{ height: "250px" }}>
        <img
          src={img ? img : "img/fruite-item-5.jpg"}
          className="w-100 h-100 object-fit-cover rounded-top"
          alt=""
        />
      </div>
      <div
        className="text-white bg-secondary px-3 py-1 rounded position-absolute"
        style={{ top: "10px", left: "10px" }}
      >
        {category}
      </div>
      <div className="p-4 border border-secondary border-top-0 rounded-bottom">
        <h4>{title}</h4>
        <p>{description}</p>
        <div className="d-flex justify-content-between flex-lg-wrap">
          <p className="text-dark fs-5 fw-bold mb-0">${price} / kg</p>
          <div
            
            className="btn border border-secondary rounded-pill px-3 text-primary"
            onClick={addToCart}
          >
            <i className="fa fa-shopping-bag me-2 text-primary"></i>
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardItem;
