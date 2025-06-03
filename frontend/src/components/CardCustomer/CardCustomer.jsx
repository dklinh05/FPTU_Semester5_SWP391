function CardCustomer() {
  return (
    <tr>
      <td>#12598</td>
      <td>John Doe</td>
      <td>test@gmail</td>
      <td>1234567890</td>
      <td>24 Nov, 2024 3:59 PM</td>
      <td className="d-flex">
        <a href="#" className="btn btn-sm">
          <i className="fa-solid fa-edit"></i>
        </a>
        <a href="#" className="btn btn-sm">
          <i className="fa-solid fa-trash"></i>
        </a>
        <div className="dropdown">
          <a
            className="nav-link px-3 pt-1 pb-2"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </a>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item py-2" href="#">
                Block
              </a>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  );
}

export default CardCustomer;
