function DashboardCard({name, total, percentage, title}) {
  return (
    <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6 mb-3">
      <div className="card shadow-sm border-0 border-radius-12">
        <div className="card-body p-4">
          <div className="row">
            <div className="col-10">
              <h6 className="text-muted mb-2">{name}</h6>
              <h3 className="fw-bold">{total}</h3>
              <div className="d-flex align-items-center">
                <span className="status-badge status-success">
                  <i className="fa-solid fa-arrow-up"></i> {percentage}%
                </span>
                <span className="text-muted ms-2">{title}</span>
              </div>
            </div>
            <div className="col-2 d-flex justify-content-center align-items-center">
              <i className="fa-solid fa-arrow-up-right-dots size-2 text-success"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
