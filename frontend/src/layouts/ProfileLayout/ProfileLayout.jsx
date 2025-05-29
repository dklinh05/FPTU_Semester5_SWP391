import classNames from 'classnames/bind';
import styles from './ProfileLayout.module.scss';
import Header from '../../components/Header';
import Sidebar from './Sidebar';

const ProfileLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar - rộng hơn */}
      <div style={{ width: "280px", flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Nội dung chính */}
      <div style={{ flex: 1, padding: "24px", backgroundColor: "#f5f5f5" }}>
        <div className="container">

          {/* Nội dung chính */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;