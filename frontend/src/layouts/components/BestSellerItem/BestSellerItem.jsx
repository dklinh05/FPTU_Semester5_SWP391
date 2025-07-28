import AddToCartButton from "../../../components/AddToCartButton";
import { Link } from "react-router-dom";
import React from "react";

function BestSellerItem({ id, title, price, img, unit,rating }) {
  const renderStars = (avg = 0) => {
    return [...Array(5)].map((_, i) => {
      const fill = i + 1 <= avg ? 100 : 0;

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

  return (
    <Link to={`/product/${id}`} className="col-lg-6 col-xl-4">
      <div className="p-4 rounded bg-light">
        <div className="row align-items-center">
          <div className="col-6">
            <img
              src={img ? img : "img/best-product-1.jpg"}
              className="w-100 object-fit-cover rounded-top"
              style={{ height: "160px", objectFit: "cover" }}
              alt=""
            />
          </div>
          <div className="col-6">
            <div className="h5">{title}</div>
            <div className="d-flex my-3 align-items-center">
              {renderStars(rating)}
              <span className="ms-2 text-muted small">({rating?.toFixed(1) || "0.0"})</span>
            </div>
            <h4 className="mb-3">{price} VND / {unit}</h4>
            <AddToCartButton id={id} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BestSellerItem;
