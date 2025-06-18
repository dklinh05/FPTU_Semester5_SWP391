import React, {useState} from "react";
import styles from "./SearchSideBar.module.scss";

function SearchSideBar() {

    // State để lưu trạng thái của các checkbox
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedLatest, setSelectedLatest] = useState(null);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);

        const searchParams = new URLSearchParams(window.location.search);
        if (category) {
            searchParams.set("category", category);
        } else {
            searchParams.delete("category");
        }

        window.history.pushState({}, "", `?${searchParams.toString()}`);
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);

        const searchParams = new URLSearchParams(window.location.search);
        if (rating) {
            searchParams.set("rating", rating);
        } else {
            searchParams.delete("rating");
        }

        window.history.pushState({}, "", `?${searchParams.toString()}`);
    };

    const handleSelectedLatest = (latest) => {
        setSelectedLatest(latest);

        const searchParams = new URLSearchParams(window.location.search);
        if (latest) {
            searchParams.set("latest", latest);
        } else {
            searchParams.delete("latest");
        }

        window.history.pushState({}, "", `?${searchParams.toString()}`);
    };

    const handleClearAll = () => {
        setSelectedCategory(null);
        setSelectedRating(null);
        setSelectedLatest(null);
        // Cập nhật URLSearchParams để xóa filter
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete("category");
        searchParams.delete("rating");
        searchParams.delete("latest");
        window.history.pushState({}, "", `?${searchParams.toString()}`);
    };

    return (
        <div className={`${styles["search-sidebar"]} p-4 rounded shadow-sm`}>
            <h4>Search Filters</h4>
            <ul className="list-unstyled">
                <li><strong> By category </strong></li>
                <li>
                    <input
                        type="checkbox"
                        checked={selectedCategory === "fruit"}
                        onChange={() => handleCategoryChange("fruit")}
                    />
                    Trái cây
                </li>
                <li>
                    <input
                        type="checkbox"
                        checked={selectedCategory === "vegetable"}
                        onChange={() => handleCategoryChange("vegetable")}
                    />
                    Rau
                </li>
                <li>
                    <input
                        type="checkbox"
                        checked={selectedCategory === "root_vegetable"}
                        onChange={() => handleCategoryChange("root_vegetable")}
                    />
                    Củ, quả
                </li>
                <hr/>
                <li><strong>Rating</strong></li>
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
                <hr/>
                <li><strong>Latest</strong></li>
                <li>
                    <input type="checkbox"
                           checked={selectedLatest === "new_arrival"}
                           onChange={() => handleSelectedLatest("new_arrival")}
                    />
                    New Arrival
                </li>
                <hr/>
                <button className="btn btn-outline-secondary w-100" onClick={handleClearAll}>
                    Clear all
                </button>
            </ul>
        </div>
    )
}

export default SearchSideBar;