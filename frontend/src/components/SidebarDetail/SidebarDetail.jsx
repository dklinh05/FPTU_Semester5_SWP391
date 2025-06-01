function SidebarDetail({ children }) {
  return (
    <>
      {/* Categories */}
      <div className="col-lg-12">
        {children}
        <div className="mb-3">
          <h4>Categories</h4>
          <ul className="list-unstyled fruite-categorie">
            {[
              { name: "Apples", count: 3 },
              { name: "Oranges", count: 5 },
              { name: "Strawberry", count: 2 },
              { name: "Banana", count: 8 },
              { name: "Pumpkin", count: 5 },
            ].map((item, index) => (
              <li key={index}>
                <div className="d-flex justify-content-between fruite-name">
                  <a href="#">
                    <i className="fas fa-apple-alt me-2"></i>
                    {item.name}
                  </a>
                  <span>({item.count})</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Price Range */}
      <div className="col-lg-12">
        <div className="mb-3">
          <h4 className="mb-2">Price</h4>
          <input
            type="range"
            className="form-range w-100"
            id="rangeInput"
            name="rangeInput"
            min="0"
            max="500"
            defaultValue="0"
            onInput={(e) =>
              (document.getElementById("amount").value = e.target.value)
            }
          />
          <output id="amount" name="amount" htmlFor="rangeInput">
            0
          </output>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="col-lg-12">
        <div className="mb-3">
          <h4>Additional</h4>
          {["Organic", "Fresh", "Sales", "Discount", "Expired"].map(
            (label, index) => (
              <div className="mb-2" key={index}>
                <input
                  type="radio"
                  className="me-2"
                  id={`Categories-${index + 1}`}
                  name="Categories-1"
                  value={label}
                />
                <label htmlFor={`Categories-${index + 1}`}> {label}</label>
              </div>
            )
          )}
        </div>
      </div>

      {/* Featured Products */}
      <div className="col-lg-12">
        <h4 className="mb-3">Featured products</h4>
        {[1, 2, 3].map((item) => (
          <div
            className="d-flex align-items-center justify-content-start"
            key={item}
          >
            <div
              className="rounded me-4"
              style={{ width: "100px", height: "100px" }}
            >
              <img
                src={`img/featur-${item}.jpg`}
                className="img-fluid rounded"
                alt=""
              />
            </div>
            <div>
              <h6 className="mb-2">Big Banana</h6>
              <div className="d-flex mb-2">
                {[1, 2, 3, 4].map((i) => (
                  <i className="fa fa-star text-secondary" key={i}></i>
                ))}
                <i className="fa fa-star"></i>
              </div>
              <div className="d-flex mb-2">
                <h5 className="fw-bold me-2">2.99 $</h5>
                <h5 className="text-danger text-decoration-line-through">
                  4.11 $
                </h5>
              </div>
            </div>
          </div>
        ))}
        <div className="d-flex justify-content-center my-4">
          <a
            href="#"
            className="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100"
          >
            View More
          </a>
        </div>
      </div>

      {/* Banner */}
      <div className="col-lg-12">
        <div className="position-relative">
          <img
            src="img/banner-fruits.jpg"
            className="img-fluid w-100 rounded"
            alt=""
          />
          <div
            className="position-absolute"
            style={{
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
            }}
          >
            <h3 className="text-secondary fw-bold">
              Fresh <br />
              Fruits <br />
              Banner
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default SidebarDetail;
