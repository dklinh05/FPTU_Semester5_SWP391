import { Link } from "react-router-dom";

function ShopBanner({ name, id }) {
  return (
    <div className="container-fluid page-header py-5">
      <h1 className="text-center text-white display-6">{name}</h1>
      <ol className="breadcrumb justify-content-center mb-0">
        <li className="breadcrumb-item">
          <a href="#">Home</a>
        </li>
        <li className="breadcrumb-item">
          <a href="#">Shop</a>
        </li>
        <Link to={`/shop/${id}`} className="breadcrumb-item active text-white">{name}</Link>
      </ol>
    </div>
  );
}

export default ShopBanner;
