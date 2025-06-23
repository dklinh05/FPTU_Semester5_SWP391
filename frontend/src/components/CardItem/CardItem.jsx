import AddToCartButton from "../AddToCartButton";

function CardItem({ id, category, title, description, price, img, shopName }) {
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
        <p
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
        <div className="d-flex justify-content-between flex-lg-wrap">
          <p className="text-dark fs-5 fw-bold mb-0">${price} / kg</p>
          <AddToCartButton id={id} />
        </div>
      </div>
    </div>
  );
}

export default CardItem;
