import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { addProductToCart } from "../../services/cartItemService";

function AddToCartButton({id}) {
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
      setReload((prev) => !prev);
      toast.success("Thêm vào giỏ thành công!");
      console.log("Response:", response);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };
  return (
    <div
      className="btn border border-secondary rounded-pill px-3 text-primary"
      onClick={handleAddToCart}
    >
      <i className="fa fa-shopping-bag me-2 text-primary"></i>
      Add to cart
    </div>
  );
}

export default AddToCartButton;
