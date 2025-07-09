import React, {useEffect, useState} from "react";
import {searchProducts} from "../../services/productService";
import {Link, useLocation} from "react-router-dom";
import styles from "./ProductSearch.module.scss";
import CardItem from "../../components/CardItem";

const ProductSearch = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword");
    const category = searchParams.get("category");
    const rating = searchParams.get("rating");
    const latest = searchParams.get("latest");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Keyword:", keyword, "Category:", category, "Rating:", rating, "Latest:", latest);
        const fetchProducts = async () => {
            if (!keyword && !category && !rating) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                const data = await searchProducts(keyword, category, rating, latest);
                setProducts(data);
            } catch (err) {
                console.error("Found error:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword, category, rating, latest]);

    return (
        <>
            <div className={`${styles["product-search"]}`}>
                <h5>Kết quả tìm kiếm cho: "{keyword}"</h5>
                {loading ? (
                    <p>Loading</p>
                ) : products.length === 0 ? (
                    <div className="text-center mt-5">
                        <img src="/images/no-results.svg" alt="No results" className="mb-3" style={{width: "100px"}}/>
                        <p className="text-danger">Không tìm thấy sản phẩm nào.</p>
                        <button className="btn btn-danger mt-3" onClick={() => {
                            // Reset filters by removing query params
                            const searchParams = new URLSearchParams(window.location.search);
                            searchParams.delete("category");
                            searchParams.delete("rating");
                            searchParams.delete("latest");
                            window.history.pushState({}, "", `?${searchParams.toString()}`);
                        }}>
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="tab-content">
                        <div id="tab-1" className="tab-pane fade show p-0 active">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="row g-4">
                                        {products?.map((product, index) => {
                                            const cards = [];

                                            cards.push(
                                                <Link
                                                    key={product.productID}
                                                    to={`/product/${product.productID}`}
                                                    className="col-md-6 col-lg-4 col-xl-3"
                                                >
                                                    <CardItem
                                                        id={product.productID}
                                                        img={product.imageURL}
                                                        category={product.category}
                                                        title={product.name}
                                                        description={product.description}
                                                        price={product.price}
                                                        shopName={product.supplier.fullName}
                                                    />
                                                </Link>
                                            );

                                            if ((index + 1) % 3 === 0) {
                                                cards.push(
                                                    <div
                                                        className="col-md-6 col-lg-4 col-xl-3 placeholder-card"
                                                    ></div>
                                                );
                                            }
                                            return cards;
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductSearch;