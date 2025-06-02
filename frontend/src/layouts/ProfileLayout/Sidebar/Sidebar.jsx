import React from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.scss";

function Sidebar() {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Profile Settings</h5>
      </div>

      <div className="list-group list-group-flush" role="tablist">
        <a
          className="list-group-item list-group-item-action active"
          data-bs-toggle="list"
          href="#account"
          role="tab"
        >
          Account
        </a>
        <a
          className="list-group-item list-group-item-action"
          data-bs-toggle="list"
          href="#password"
          role="tab"
        >
          Password
        </a>
        <a
          className="list-group-item list-group-item-action"
          data-bs-toggle="list"
          href="#web-notifications"
          role="tab"
        >
          My purchase
        </a>
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