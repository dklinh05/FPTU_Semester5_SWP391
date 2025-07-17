function CheckoutItem({ quantity, img, name, price }) {
  return (
    <tr>
      <th></th>
      <th scope="row">
        <div className="d-flex align-items-center mt-2">
          <img
            src={img ? img : "img/vegetable-item-3.png"}
            className="img-fluid rounded-circle"
            style={{ width: "90px", height: "90px" }}
            alt=""
          />
        </div>
      </th>
      <td className="py-5">{name}</td>
      <td className="py-5">${price}</td>
      <td className="py-5">{quantity}</td>
      <td className="py-5">${price * quantity}</td>
    </tr>
  );
}

export default CheckoutItem;
