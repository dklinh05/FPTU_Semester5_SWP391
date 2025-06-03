import React from "react";
import Header from "../../components/Header";
import Sidebar from "./Sidebar"; // Đảm bảo đúng đường dẫn đến Sidebar của bạn
import Profile from "../../pages/Profile";
import Spinner from "../../components/Spinner";
import Footer from "../../components/Footer";
const ProfileLayout = ({children}) => {
  return (
   
      <div className="container-fluid py-5 mt-5">
        
        <div className="container py-5">
          <div className="row g-4">
            {/* Sidebar - Bên trái */}
            <div className="col-md-3">
              <Sidebar />
            </div>
  
            {/* Nội dung chính - Bên phải */}
            <div className="col-md-9">
              {children}
            </div>
          </div>
        </div>
        <Footer />
      </div>
   
  );
};

export default ProfileLayout;
