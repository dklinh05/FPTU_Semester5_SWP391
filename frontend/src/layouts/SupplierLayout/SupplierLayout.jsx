import SidebarSupplier from "../components/SidebarSupplier";
import HeaderAdmin from "../components/HeaderSupplier/HeaderSupplier";

function SupplierLayout({children}) {
  return (
    <>
      <div id="main-wrapper" className="d-flex">
        <SidebarSupplier />
        <div className="content-wrapper">
           <HeaderAdmin/>
          {children}
        </div>
      </div>
    </>
  );
}

export default SupplierLayout;
