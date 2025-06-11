function Footer() {
  return (
    <>
      {/* Footer Start */}
      <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
        <div className="container py-5">
          <div
            className="pb-4 mb-4"
            style={{ borderBottom: "1px solid rgba(226, 175, 24, 0.5)" }}
          >
            <div className="row g-4">
              <div className="col-lg-3">
                <a href="#">
                  <h1 className="text-primary mb-0">Farm Trade</h1>
                  <p className="text-secondary mb-0">Fresh products</p>
                </a>
              </div>
              <div className="col-lg-6">
                <div className="position-relative mx-auto">
                  <input
                    className="form-control border-0 w-100 py-3 px-4 rounded-pill"
                    type="number"
                    placeholder="Your Email"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary border-0 border-secondary py-3 px-4 position-absolute rounded-pill text-white"
                    style={{ top: 0, right: 0 }}
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="d-flex justify-content-end pt-3">
                  <a
                    className="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
                    href="#"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    className="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
                    href="#"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    className="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
                    href="#"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a
                    className="btn btn-outline-secondary btn-md-square rounded-circle"
                    href="#"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Why People Like us!</h4>
                <p className="mb-4">
                  Fresh and organic products are our priority. We ensure that
                  our products are sourced from the best farms, providing you
                  with the highest quality and freshest produce available.
                </p>
                <a
                  href="#"
                  className="btn border-secondary py-2 px-4 rounded-pill text-primary"
                >
                  Read More
                </a>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Shop Info</h4>
                <a className="btn-link" href="#">
                  About Us
                </a>
                <a className="btn-link" href="#">
                  Contact Us
                </a>
                <a className="btn-link" href="#">
                  Privacy Policy
                </a>
                <a className="btn-link" href="#">
                  Terms & Condition
                </a>
                <a className="btn-link" href="#">
                  Return Policy
                </a>
                <a className="btn-link" href="#">
                  FAQs & Help
                </a>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Account</h4>
                <a className="btn-link" href="#">
                  My Account
                </a>
                <a className="btn-link" href="#">
                  Shop details
                </a>
                <a className="btn-link" href="#">
                  Shopping Cart
                </a>
                <a className="btn-link" href="#">
                  Wishlist
                </a>
                <a className="btn-link" href="#">
                  Order History
                </a>
                <a className="btn-link" href="#">
                  International Orders
                </a>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Contact</h4>
                <p>Address: Da Nang city, Viet Nam</p>
                <p>Email: farmtrade43@gmail.com</p>
                <p>Payment Accepted</p>
                <img
                  src="img/payment.png"
                  className="img-fluid"
                  alt="Payment Methods"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}

      {/* Copyright Start */}
      <div className="container-fluid copyright bg-dark py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <span className="text-light">
                <a href="#">
                  <i className="fas fa-copyright text-light me-2"></i>
                  Farm Trade
                </a>
                , All right reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright End */}

      {/* Back to Top */}
      <a
        href="#"
        className="btn btn-primary border-3 border-primary rounded-circle back-to-top"
      >
        <i className="fa fa-arrow-up"></i>
      </a>
    </>
  );
}

export default Footer;
