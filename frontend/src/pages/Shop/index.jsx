import { Link } from "react-router-dom";
import CardItem from "../../components/CardItem/CardItem";

function Shop({ products }) {

  return (
    <div className="col-lg-9">
      <div className="row g-4 justify-content-center">
        {products?.map((product, index) => (
          <Link
            to={`/product/${product.productID}`}
            className="col-md-6 col-lg-4 col-xl-3"
          >
            <CardItem
              key={index}
              id={product.productID}
              img={product.imageURL}
              category={product.category}
              title={product.name}
              description={product.description}
              price={product.price}
            />
          </Link>
        ))}


      </div>
    </div>
  );
}

export default Shop;
