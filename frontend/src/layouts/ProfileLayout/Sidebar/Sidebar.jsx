import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import styles from "./Sidebar.module.scss";

function Sidebar() {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Profile Settings</h5>
      </div>

      <div className="list-group list-group-flush" role="tablist">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${isActive ? "active" : ""}`
          }
          role="tab"
        >
          Account
        </NavLink>

        <NavLink
          to="/change-password"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${isActive ? "active" : ""}`
          }
          role="tab"
        >
          Password
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${isActive ? "active" : ""}`
          }
          role="tab"
        >
          My purchase
        </NavLink>

        <a
          className="list-group-item list-group-item-action"
          data-bs-toggle="list"
          href="#delete-account"
          role="tab"
        >
          Delete account
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
