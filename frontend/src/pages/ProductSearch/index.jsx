import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { searchProducts } from "../../services/productService";
import {Link, useLocation} from "react-router-dom";
import styles from "./ProductSearch.module.scss";
import CardItem from "../../components/CardItem/index.js";

const ProductSearch = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Keyword:", keyword);
        const fetchProducts = async () => {
            if (!keyword) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                const data = await searchProducts(keyword);
                setProducts(data);
            } catch (err) {
                console.error("Found error:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword]);

    return (
        <>
            {/*<Header />*/}
            <div className={`${styles["product-search"]}`}>
                <h3>Kết quả tìm kiếm cho: "{keyword}"</h3>
                {loading ? (
                    <p>Loading</p>
                ) : products.length === 0 ? (
                    <p>Không tìm thấy sản phẩm nào.</p>
                ) : (
                    <div className="tab-content">
                        <div id="tab-1" className="tab-pane fade show p-0 active">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="row g-4">
                                        {products?.map((product, index) => (
                                            <Link
                                                to={`/product/${product.productID}`}
                                                className="col-md-6 col-lg-4 col-xl-3"
                                            >
                                                <CardItem
                                                    key={index}
                                                    id={product.productID}
                                                    img={product.imageURL}
                                                    category={product.category}
                                                    title={product.name}
                                                    description={product.description}
                                                    price={product.price}
                                                    shopName={product.supplier.fullName}
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="tab-2" className="tab-pane fade show p-0"></div>
                        <div id="tab-3" className="tab-pane fade show p-0"></div>
                        <div id="tab-4" className="tab-pane fade show p-0"></div>
                        <div id="tab-5" className="tab-pane fade show p-0"></div>

                        {/* Các tab khác (tab-2, tab-3...) có thể thêm tương tự ở đây */}
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductSearch;