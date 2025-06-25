import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { addProductToCart } from "../../services/cartItemService";
import styles from "./CardItem.module.scss"

function CardItem({ id, category, title, description, price, img, shopName, unit,soldCount }) {
  const { userId } = useUser();
  const { setReload } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productData = new FormData();

    productData.append("buyerId", userId);
    productData.append("productId", id);
    productData.append("quantity", 1);

    try {
      const response = await addProductToCart(productData);
      setReload(prev => !prev);
       toast.success("Thêm vào giỏ thành công!");
      console.log("Response:", response);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  return (
    <div className="rounded position-relative fruite-item border border-warning">
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
      <div
        className="text-white bg-primary px-3 py-1 rounded position-absolute"
        style={{ top: "10px", right: "10px" }}
      >
        {shopName}
      </div>
      <div className="p-4">
        <h4>{title}</h4>
          <p className={styles.cardDescription}>{description}</p>
        <div className="d-flex justify-content-between flex-lg-wrap">
          <p className="text-dark fs-5 fw-bold mb-0">{price} VND / {unit}</p>
            <p className="text-muted mb-2">Sold: {soldCount || 0}</p>
          <div
            className="btn border border-secondary rounded-pill px-3 text-primary"
            onClick={handleAddToCart}
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
