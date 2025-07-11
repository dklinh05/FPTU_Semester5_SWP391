import SidebarShipper from "./SidebarShipper/SidebarShipper";

function ShipperLayout({children}) {
   return (
    <>
      <div id="main-wrapper" className="d-flex">
        <SidebarShipper/>
        <div className="content-wrapper">
          {/* <HeaderAdmin/> */}
          {children}
        </div>
      </div>
    </>
  );
}

export default ShipperLayout;