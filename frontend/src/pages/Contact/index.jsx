import React from 'react';

function Contact() {
  return (
    <div className="container-fluid contact py-5">
      <div className="container py-5">
        <div className="p-5 bg-light rounded">
          <div className="row g-4">

            {/* Tiêu đề */}
            <div className="col-12 text-center mx-auto" style={{ maxWidth: "700px" }}>
              <h1 className="text-primary">Get in touch</h1>
              <p className="mb-4">
                {/* The contact form is currently inactive. Get a functional and working contact form with Ajax & PHP in a few minutes.
                Just copy and paste the files, add a little code and you're done.{' '}
                <a href="https://htmlcodex.com/contact-form">Download  Now</a>. */}
              </p>
            </div>

            {/* Google Map */}
            <div className="col-lg-12">
              <div className="h-100 rounded">
                <iframe
                  className="rounded w-100"
                  style={{ height: '400px' }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.576408987896!2d108.2109217751025!3d16.05774308925679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421aafbeecea3b%3A0xe9e35065f0aee26f!2zRMOhu5MgSOG7kyBDaeG6vyBUcsDhuqFpLCBWaeG7h3UgTWFp!5e0!3m2!1svi!2sbd!4v1694261200588!5m2!1svi!2sbd"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
                ></iframe>
              </div>
            </div>

            {/* Form liên hệ */}
            <div className="col-lg-7">
              <form action="" className="">
                <input
                  type="text"
                  className="w-100 form-control border-0 py-3 mb-4"
                  placeholder="Your Name"
                />
                <input
                  type="email"
                  className="w-100 form-control border-0 py-3 mb-4"
                  placeholder="Enter Your Email"
                />
                <textarea
                  className="w-100 form-control border-0 mb-4"
                  rows="5"
                  cols="10"
                  placeholder="Your Message"
                ></textarea>
                <button
                  className="w-100 btn form-control border-secondary py-3 bg-white text-primary"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* Thông tin liên hệ */}
            <div className="col-lg-5">
              <div className="d-flex p-4 rounded mb-4 bg-white">
                <i className="fas fa-map-marker-alt fa-2x text-primary me-4"></i>
                <div>
                  <h4>Address</h4>
                  <p className="mb-2">Đà Nẵng, Việt Nam</p>
                </div>
              </div>

              <div className="d-flex p-4 rounded mb-4 bg-white">
                <i className="fas fa-envelope fa-2x text-primary me-4"></i>
                <div>
                  <h4>Mail Us</h4>
                  <p className="mb-2">farmtrade43@gmail.com</p>
                </div>
              </div>

              <div className="d-flex p-4 rounded bg-white">
                <i className="fa fa-phone-alt fa-2x text-primary me-4"></i>
                <div>
                  <h4>Telephone</h4>
                  <p className="mb-2">(+083) 412 4848 </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;