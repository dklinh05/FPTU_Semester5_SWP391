function Product() {
  return (
    <>
      <div className="col-lg-6">
        <div className="border rounded">
          <a href="#">
            <img
              src="img/single-item.jpg"
              className="img-fluid rounded"
              alt="Image"
            />
          </a>
        </div>
      </div>
      <div className="col-lg-6">
        <h4 className="fw-bold mb-3">Brocoli</h4>
        <p className="mb-3">Category: Vegetables</p>
        <h5 className="fw-bold mb-3">3,35 $</h5>
        <div className="d-flex mb-4">
          <i className="fa fa-star text-secondary"></i>
          <i className="fa fa-star text-secondary"></i>
          <i className="fa fa-star text-secondary"></i>
          <i className="fa fa-star text-secondary"></i>
          <i className="fa fa-star"></i>
        </div>
        <p className="mb-4">
          The generated Lorem Ipsum is therefore always free from repetition
          injected humour, or non-characteristic words etc.
        </p>
        <p className="mb-4">
          Susp endisse ultricies nisi vel quam suscipit. Sabertooth peacock
          flounder; chain pickerel hatchetfish, pencilfish snailfish
        </p>
        <div className="input-group quantity mb-5" style={{ width: "100px" }}>
          <div className="input-group-btn">
            <button className="btn btn-sm btn-minus rounded-circle bg-light border">
              <i className="fa fa-minus"></i>
            </button>
          </div>
          <input
            type="text"
            className="form-control form-control-sm text-center border-0"
            defaultValue="1"
          />
          <div className="input-group-btn">
            <button className="btn btn-sm btn-plus rounded-circle bg-light border">
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
        <a
          href="#"
          className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
        >
          <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
        </a>
      </div>
    </>
  );
}

export default Product;
