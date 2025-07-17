import SidebarAdmin from "../components/SideBarAdmin";
import HeaderAdmin from "../components/HeaderSupplier";

function AdminLayout({ children }) {
  return (
    <>
      {/* <div id="preloader">
          <div className="spinner"></div>
      </div> */}
      <div id="main-wrapper" className="d-flex">
        <SidebarAdmin />
        <div className="content-wrapper">
        {/* <HeaderAdmin/> */}
          {children}
          </div>
      </div>
    </>
  );
}

export default AdminLayout;
