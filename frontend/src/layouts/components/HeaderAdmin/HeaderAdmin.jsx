function HeaderAdmin() {
  return (
    <div className="header px-0 px-md-0 px-lg-3 pt-2 pt-sm-2 pt-md-2 pt-lg-4">
      <div className="container-fluid">
        <div className="row">
          <div className="col-6 col-lg-6 d-flex">
            <button className="menu-toggle btn btn-lg text-white d-block d-lg-none">
              <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className="header-title d-none d-lg-block">Order</h1>
          </div>
          <div className="col-6 col-lg-6 d-flex justify-content-end">
            <div>
              <ul className="nav d-flex align-items-center">
                <li className="nav-item">
                  <a
                    className="nav-link notification notification-notify"
                    href="#"
                    id="Notification"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-regular fa-bell"></i>
                  </a>
                  <div className="dropdown-menu" data-bs-popper="none">
                    <div
                      id="Notification"
                      className="h-380 scroll-y p-3 custom-scrollbar"
                    >
                      <ul className="timeline">
                        <li>
                          <div className="timeline-panel">
                            <div className="media me-2">
                              <img
                                alt="image"
                                width="50"
                                src="./assets/images/profile.png"
                              />
                            </div>
                            <div className="media-body">
                              <h6 className="mb-1">Dr Halk Send you Photo</h6>
                              <small className="d-block">
                                29 July 2020 - 02:26 PM
                              </small>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="timeline-panel">
                            <div className="media me-2 media-info">HK</div>
                            <div className="media-body">
                              <h6 className="mb-1">
                                Resport created successfully
                              </h6>
                              <small className="d-block">
                                29 July 2020 - 02:26 PM
                              </small>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="timeline-panel">
                            <div className="media me-2 media-success">
                              <i className="fa fa-home"></i>
                            </div>
                            <div className="media-body">
                              <h6 className="mb-1">
                                Reminder : Treatment Time!
                              </h6>
                              <small className="d-block">
                                29 July 2020 - 02:26 PM
                              </small>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="timeline-panel">
                            <div className="media me-2">
                              <img
                                alt="image"
                                width="50"
                                src="./assets/images/profile.png"
                              />
                            </div>
                            <div className="media-body">
                              <h6 className="mb-1">Dr Halk Send you Photo</h6>
                              <small className="d-block">
                                29 July 2020 - 02:26 PM
                              </small>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="timeline-panel">
                            <div className="media me-2 media-danger">HG</div>
                            <div className="media-body">
                              <h6 className="mb-1">
                                Resport created successfully
                              </h6>
                              <small className="d-block">
                                29 July 2020 - 02:26 PM
                              </small>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="timeline-panel">
                            <div className="media me-2 media-primary">
                              <i className="fa fa-home"></i>
                            </div>
                            <div className="media-body">
                              <h6 className="mb-1">
                                Reminder : Treatment Time!
                              </h6>
                              <small className="d-block">
                                29 July 2020 - 02:26 PM
                              </small>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <a className="all-notification" href="#">
                      See all notifications{" "}
                      <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </li>
                <li className="dropdown">
                  <a
                    className="nav-link"
                    href="#"
                    id="navbarDropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src="./assets/images/profile.png"
                      className="profile-img"
                      alt="profile"
                    />
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <li>
                      <a className="dropdown-item py-2" href="profile.html">
                        <i className="fa-solid fa-user me-2 text-success"></i>
                        Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item py-2" href="#">
                        <i className="fa-solid fa-gear me-2 text-info"></i>
                        Setting
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item py-2" href="#">
                        <i className="fa-solid fa-right-from-bracket me-2 text-danger"></i>
                        Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
