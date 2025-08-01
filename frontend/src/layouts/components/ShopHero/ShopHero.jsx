import SearchDetail from "../../../components/SearchDetail";

function ShopHero({ sortValue, setSortValue }) {
  return (
    <div className="row g-4">
      {/* Search Input */}
      <div className="col-xl-3">
        <SearchDetail />
      </div>
      {/* Spacer Column */}
      <div className="col-6"></div>

      {/* Sorting Dropdown */}
      <div className="col-xl-3">
        <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
          <label htmlFor="fruits" className="me-2">
            Default Sorting:
          </label>
          <select
            id="fruits"
            name="fruitlist"
            className="border-0 form-select-sm bg-light me-3"
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
          >
            <option value="createdAt">Newest</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ShopHero;
