import React from "react";
import Header from "../../components/Header";
import SearchSideBar from "./SearchSideBar/SearchSideBar";
import Footer from "../../components/Footer/Footer";

const SearchResultLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container-fluid py-5 mt-5">
        <div className="row g-4">
          <div className="col-md-3">
            <SearchSideBar />
          </div>
          <div className="col-md-8">{children}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default SearchResultLayout;
