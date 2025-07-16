import React, { useEffect, useState } from "react";
import { renderAllProductsAdmin, deleteProduct } from "../../services/productService";
import PaginationTab from "../../components/PaginationTab/PaginationTab";
import PopupModal from "../../components/PopupModal/PopupModal";
import styles from "./AdminListProduct.module.scss";

const AdminListProduct = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const fetchProducts = async (page) => {
        try {
            const response = await renderAllProductsAdmin(page - 1, pageSize);
            setProducts(response.content);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalElements);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;
        try {
            await deleteProduct(selectedProduct.productID);
            fetchProducts(currentPage);
        } catch (error) {
            console.error("Lỗi khi xoá sản phẩm:", error);
        } finally {
            setShowModal(false);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className="mb-4 fw-bold text-success">Danh sách sản phẩm</h3>

            <div className="table-responsive">
                <table className="table align-middle">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ảnh</th>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Đã bán</th>
                        <th>Kho</th>
                        <th>Trạng thái</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.productID}>
                                <td>{product.productID}</td>
                                <td>
                                    <img
                                        src={product.imageURL}
                                        alt={product.name}
                                        className="img-thumbnail"
                                        width="50"
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.sales}</td>
                                <td>{product.stockQuantity}</td>
                                <td>
                    <span
                        className={`status-badge ${
                            product.status === "In Stock"
                                ? "status-success"
                                : "status-danger"
                        }`}
                    >
                      {product.status}
                    </span>
                                </td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDeleteClick(product)}
                                    >
                                        <i className="fa-solid fa-trash" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center text-muted py-4">
                                Không có sản phẩm nào.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <PaginationTab
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                setCurrentPage={setCurrentPage}
            />

            <PopupModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xoá sản phẩm"
                body={`Bạn có chắc chắn muốn xoá sản phẩm "${selectedProduct?.name}" không?`}
                confirmText="Xoá"
                cancelText="Huỷ"
            />
        </div>
    );
};

export default AdminListProduct;
