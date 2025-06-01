import CardItem from "../../../components/CardItem/CardItem";

function ShopStart() {
  return (
    <div className="container-fluid fruite py-5">
      <div className="container py-5">
        <div className="tab-class text-center">
          <div className="row g-4">
            <div className="col-lg-4 text-start">
              <h1>Our Organic Products</h1>
            </div>
            <div className="col-lg-8 text-end">
              <ul className="nav nav-pills d-inline-flex text-center mb-5">
                <li className="nav-item">
                  <a
                    className="d-flex m-2 py-2 bg-light rounded-pill active"
                    data-bs-toggle="pill"
                    href="#tab-1"
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      All Products
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="d-flex py-2 m-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    href="#tab-2"
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Vegetables
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="d-flex m-2 py-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    href="#tab-3"
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Fruits
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="d-flex m-2 py-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    href="#tab-4"
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Bread
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="d-flex m-2 py-2 bg-light rounded-pill"
                    data-bs-toggle="pill"
                    href="#tab-5"
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      Meat
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <div className="row g-4">
                <div className="col-lg-12">
                  <div className="row g-4">
                    <div className="col-md-6 col-lg-4 col-xl-3">
                      <CardItem
                        category="Fruits"
                        title="Grapes"
                        description=" Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod
        te incididunt"
                        price="4.99"
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3">
                      <CardItem
                        category="Fruits"
                        title="Grapes"
                        description=" Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod
        te incididunt"
                        price="4.99"
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3">
                      <CardItem
                        category="Fruits"
                        title="Grapes"
                        description=" Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod
        te incididunt"
                        price="4.99"
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3">
                      <CardItem
                        category="Fruits"
                        title="Grapes"
                        description=" Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod
        te incididunt"
                        price="4.99"
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3">
                      <CardItem
                        category="Fruits"
                        title="Grapes"
                        description=" Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod
        te incididunt"
                        price="4.99"
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3">
                      <CardItem
                        category="Fruits"
                        title="Grapes"
                        description=" Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod
        te incididunt"
                        price="4.99"
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3">
                      <CardItem
                        category="Fruits"
                        title="Grapes"
                        description=" Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod
        te incididunt"
                        price="4.99"
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3">
                      <CardItem
                        category="Fruits"
                        title="Grapes"
                        description=" Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod
        te incididunt"
                        price="4.99"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="tab-2" class="tab-pane fade show p-0"></div>
            <div id="tab-3" class="tab-pane fade show p-0"></div>
            <div id="tab-4" class="tab-pane fade show p-0"></div>
            <div id="tab-5" class="tab-pane fade show p-0"></div>

            {/* Các tab khác (tab-2, tab-3...) có thể thêm tương tự ở đây */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopStart;
