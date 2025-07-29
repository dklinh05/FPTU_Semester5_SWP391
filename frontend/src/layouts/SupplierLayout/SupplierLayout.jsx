import SidebarSupplier from "../components/SidebarSupplier";
import HeaderSupplier from "../components/HeaderSupplier/HeaderSupplier";

function SupplierLayout({children}) {
  return (
    <>
      <div id="main-wrapper" className="d-flex">
        <SidebarSupplier />
        <div className="content-wrapper pt-5">
           <HeaderSupplier/>
          {children}
        </div>
      </div>
    </>
  );
}

export default SupplierLayout;
