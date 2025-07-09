import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SearchSideBar.module.scss";

function SearchSideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  // State để lưu trạng thái của các checkbox
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedLatest, setSelectedLatest] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSelectedCategory(searchParams.get("category"));
    setSelectedRating(searchParams.get("rating"));
    setSelectedLatest(searchParams.get("latest"));
  }, [location.search]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    const searchParams = new URLSearchParams(location.search);
    if (category) {
      searchParams.set("category", category);
    } else {
      searchParams.delete("category");
    }

    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);

    const searchParams = new URLSearchParams(location.search);
    if (rating) {
      searchParams.set("rating", rating);
    } else {
      searchParams.delete("rating");
    }

    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const handleSelectedLatest = (latest) => {
    setSelectedLatest(latest);

   const searchParams = new URLSearchParams(location.search);
    if (latest) {
      searchParams.set("latest", latest);
    } else {
      searchParams.delete("latest");
    }

    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const handleClearAll = () => {
    setSelectedCategory(null);
    setSelectedRating(null);
    setSelectedLatest(null);
    // Cập nhật URLSearchParams để xóa filter
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("category");
    searchParams.delete("rating");
    searchParams.delete("latest");
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  return (
    <div className={`${styles["search-sidebar"]} p-4 rounded shadow-sm`}>
      <h4>Search Filters</h4>
      <ul className="list-unstyled">
        <li>
          <strong> By category </strong>
        </li>
        <li>
          <input
            type="checkbox"
            checked={selectedCategory === "trái cây"}
            onChange={() => handleCategoryChange("trái cây")}
          />
          Trái cây
        </li>
        <li>
          <input
            type="checkbox"
            checked={selectedCategory === "rau"}
            onChange={() => handleCategoryChange("rau")}
          />
          Rau
        </li>
        <li>
          <input
            type="checkbox"
            checked={selectedCategory === "củ, quả"}
            onChange={() => handleCategoryChange("củ, quả")}
          />
          Củ, quả
        </li>
        <hr />
        <li>
          <strong>Rating</strong>
        </li>
        <li>
          <input
            type="checkbox"
            checked={selectedRating === "5"}
            onChange={() => handleRatingChange("5")}
          />
          ★★★★★
        </li>
        <li>
          <input
            type="checkbox"
            checked={selectedRating === "4"}
            onChange={() => handleRatingChange("4")}
          />
          ★★★★☆ & Up
        </li>
        <li>
          <input
            type="checkbox"
            checked={selectedRating === "3"}
            onChange={() => handleRatingChange("3")}
          />
          ★★★☆☆ & Up
        </li>
        <li>
          <input
            type="checkbox"
            checked={selectedRating === "2"}
            onChange={() => handleRatingChange("2")}
          />
          ★★☆☆☆ & Up
        </li>
        <li>
          <input
            type="checkbox"
            checked={selectedRating === "1"}
            onChange={() => handleRatingChange("1")}
          />
          ★☆☆☆☆ & Up
        </li>
        <hr />
        <li>
          <strong>Latest</strong>
        </li>
        <li>
          <input
            type="checkbox"
            checked={selectedLatest === "new_arrival"}
            onChange={() => handleSelectedLatest("new_arrival")}
          />
          New Arrival
        </li>
        <hr />
        <button
          className="btn btn-outline-secondary w-100"
          onClick={handleClearAll}
        >
          Clear all
        </button>
      </ul>
    </div>
  );
}

export default SearchSideBar;
