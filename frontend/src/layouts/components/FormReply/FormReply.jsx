function FormReply() {
    return ( <form action="#">
  <h4 className="mb-5 fw-bold">Leave a Reply</h4>
  <div className="row g-4">
    <div className="col-lg-6">
      <div className="border-bottom rounded">
        <input
          type="text"
          className="form-control border-0 me-4"
          placeholder="Your Name *"
        />
      </div>
    </div>
    <div className="col-lg-6">
      <div className="border-bottom rounded">
        <input
          type="email"
          className="form-control border-0"
          placeholder="Your Email *"
        />
      </div>
    </div>
    <div className="col-lg-12">
      <div className="border-bottom rounded my-4">
        <textarea
          className="form-control border-0"
          cols="30"
          rows="8"
          placeholder="Your Review *"
          spellCheck="false"
        ></textarea>
      </div>
    </div>
    <div className="col-lg-12">
      <div className="d-flex justify-content-between py-3 mb-5">
        <div className="d-flex align-items-center">
          <p className="mb-0 me-3">Please rate:</p>
          <div className="d-flex align-items-center" style={{ fontSize: "12px" }}>
            <i className="fa fa-star text-muted"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
          </div>
        </div>
        <a
          href="#"
          className="btn border border-secondary text-primary rounded-pill px-4 py-3"
        >
          Post Comment
        </a>
      </div>
    </div>
  </div>
</form>
 );
}

export default FormReply;