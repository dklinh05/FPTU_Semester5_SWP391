function SearchDetail() {
  return (
    <div className="input-group w-100 mx-auto d-flex">
      <input
        type="search"
        className="form-control p-3"
        placeholder="keywords"
        aria-describedby="search-icon-1"
      />
      <span id="search-icon-1" className="input-group-text p-3">
        <i className="fa fa-search"></i>
      </span>
    </div>
  );
}

export default SearchDetail;
