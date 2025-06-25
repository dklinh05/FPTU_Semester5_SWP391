import AddToCartButton from "../../../components/AddToCartButton";
import { Link } from "react-router-dom";

function BestSellerItem({ id, title, price, img }) {
  return (
    <Link to={`/product/${id}`} className="col-lg-6 col-xl-4">
      <div className="p-4 rounded bg-light">
        <div className="row align-items-center">
          <div className="col-6">
            <img
              src={img ? img : "img/best-product-1.jpg"}
              className="w-100 h-100 object-fit-cover rounded-top"
              alt=""
            />
          </div>
          <div className="col-6">
            <div className="h5">{title}</div>
            <div className="d-flex my-3">
              <i className="fas fa-star text-primary"></i>
              <i className="fas fa-star text-primary"></i>
              <i className="fas fa-star text-primary"></i>
              <i className="fas fa-star text-primary"></i>
              <i className="fas fa-star"></i>
            </div>
            <h4 className="mb-3">{price} $</h4>
            <AddToCartButton id={id} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BestSellerItem;
