import React from "react";
import Header from "../../components/Header";
import Sidebar from "./Sidebar";
import Footer from "../../components/Footer";


const ProfileLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container-fluid py-5 mt-5">
  <div
    className="container-fluid mt-5"
    style={{ paddingTop: "7rem", paddingBottom: "3rem" }}
  >
    <div className="row justify-content-center g-4">
      {/* Sidebar - Bên trái */}
      <div className="col-md-2">
        <Sidebar />
      </div>

      {/* Nội dung chính - Bên phải */}
      <div className="col-md-7">
        {children}
      </div>
    </div>
  </div>
</div>

      <Footer />
    </>
  );
};


export default ProfileLayout;