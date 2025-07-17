import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "/src/context/UserContext";

function HeaderSupplier() {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate("/supplier/profile");
  };

  return (
      <div className="header px-0 px-md-0 px-lg-3 pt-2 pt-sm-2 pt-md-2 pt-lg-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-6 d-flex">
              <button className="menu-toggle btn btn-lg text-white d-block d-lg-none">
                <i className="fa-solid fa-bars"></i>
              </button>
            </div>

            <div className="col-6 d-flex justify-content-end align-items-center">
              <ul className="nav d-flex align-items-center mb-0">
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
                        src={user?.avatar}
                        className="profile-img"
                        alt="profile"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                    />
                  </a>

                  <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdownMenuLink"
                  >
                    <li>
                      <a
                          className="dropdown-item py-2"
                          onClick={handleProfileClick}
                      >
                        <i className="fa-solid fa-user me-2 text-success"></i>
                        Profile
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}

export default HeaderSupplier;
