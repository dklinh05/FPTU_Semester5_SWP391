import React from "react";
import styles from "./SideBarDetail.module.scss";

function SidebarDetail({ supplier = {}, topProducts = [] }) {
    return (
        <div className="col-lg-12">
            {supplier && (
                <div className={styles.shopInfoCard}>
                    <div className="d-flex align-items-start">

                        <div className={`${styles.avatarContainer} me-3`}>
                            <img
                                src={supplier.avatar || "/public/img/avatar.jpg"}
                                alt={supplier.businessName}
                                className="rounded-circle shadow-sm"
                            />
                        </div>

                        <div className="flex-grow-1">
                            <h5 className="mb-1 fw-bold text-dark">{supplier.businessName}</h5>

                            {supplier.certification && (
                                <div className={`${styles.certification} mb-2`}>
                                    <img
                                        src={supplier.certification}
                                        alt="certification"
                                    />
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            <div className={styles.topProductsSection}>
                <h4 className="mb-3">Top Products</h4>

                {topProducts.length === 0 ? (
                    <p className="text-muted">No products available.</p>
                ) : (
                    topProducts.map((product) => (
                        <div key={product.productID} className="d-flex align-items-center mb-3">
                            <img
                                src={product.imageURL || "/img/default-product.jpg"}
                                alt={product.name}
                                style={{
                                    width: "192px",
                                    height: "192px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                }}
                            />
                            <div className="ms-3">
                                <h6 className="mb-1">{product.name}</h6>
                                <h5 className="fw-bold text-success">{product.price} VND</h5>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default SidebarDetail;
