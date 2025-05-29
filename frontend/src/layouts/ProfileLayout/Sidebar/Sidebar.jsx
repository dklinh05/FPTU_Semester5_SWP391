import React from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
    return (
        <div className={styles.sidebar}> {}
            <h4>User Menu</h4>
            <ul className={styles.menu}>
                <li><Link to="/notifications">Notifications</Link></li>
                <li><Link to="/my-account">My Account</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/address">Address</Link></li>
                <li><Link to="/change-password">Change Password</Link></li>
                <li><Link to="/privacy-settings">Privacy Settings</Link></li>
                <li><Link to="/my-purchase">My Purchase</Link></li>
                <li><Link to="/my-point">My Point</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;