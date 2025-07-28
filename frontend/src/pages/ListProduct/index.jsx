import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
    renderProductBySupplierId, deleteProduct, updateProduct, updateProductStatus, renderAllProductsAdmin,
} from "../../services/productService";
import PaginationTab from "../../components/PaginationTab/PaginationTab";
import EditProductModal from "/src/components/EditProductModal/EditProductModal"
import PopupModal from "../../components/PopupModal/PopupModal";
import { toast } from "react-toastify";


const ListProduct = () => {
    const { userId } = useUser();
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [sortValue, setSortValue] = useState("createdAt");
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const isAdminPage = location.pathname.includes("/admin");

    const [currentPage, setCurrentPage] = useState(1); // trang đang xem (1-based)
    const pageSize = 10; // số dòng mỗi trang
    const [totalItems, setTotalItems] = useState(0); // tổng số đơn hàng
    const [totalPages, setTotalPages] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const getProducts = async () => {
        try {
            const effectiveStatus = status === null ? null : status;

            const response = isAdminPage ? await renderAllProductsAdmin(currentPage - 1, pageSize) : await renderProductBySupplierId(userId, effectiveStatus, sortValue, "desc", currentPage - 1, pageSize);

            setProducts(response.content);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalElements);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        }
    };

    useEffect(() => {
        getProducts();
    }, [status, sortValue, userId, currentPage, pageSize, location.search]);

    const handleSelectAll = (e) => {
        const newSelected = new Set();
        if (e.target.checked) {
            products.forEach((product) => newSelected.add(product.productID));
        }
        setSelectedItems(newSelected);
    };

    const handleSelectRow = (id) => {
        const updated = new Set(selectedItems);
        if (updated.has(id)) {
            updated.delete(id);
        } else {
            updated.add(id);
        }
        setSelectedItems(updated);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await deleteProduct(productToDelete.productID);
            toast.success("Xóa sản phẩm thành công!");
            await getProducts();
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm!");
        } finally {
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const handleProductUpdate = async (updatedProduct) => {
        try {
            await updateProduct(updatedProduct.productID, updatedProduct);
            setShowEditModal(false);
            toast.success("Cập nhật sản phẩm thành công!");
            await getProducts();
        } catch (error) {
            toast.error("Lỗi khi cập nhật sản phẩm: " + error);
        }
    };

    const confirmDelete = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleHide = async (product) => {
        try {
            await updateProductStatus(product.productID, "Hidden");
            toast.success(`Đã ẩn sản phẩm "${product.name}"`);
            await getProducts();
        } catch (error) {
            toast.error("Lỗi khi ẩn sản phẩm");
        }
    };

    const handleUnhide = async (product) => {
        try {
            await updateProductStatus(product.productID, "Active");
            toast.success(`Đã hiện lại sản phẩm "${product.name}"`);
            await getProducts();
        } catch (error) {
            toast.error("Lỗi khi hiện lại sản phẩm");
        }
    };

    return (<>
        {/* Header section - Added from your HTML */}
        <div className="card-service-section px-0 px-md-0 px-lg-3">
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center bg-teal py-3">
                    {/* Import and Export Buttons (visible only on lg screens) */}
                    <div className="d-none d-lg-flex gap-2">
                        <button className="btn btn-light d-flex align-items-center gap-2">
                            <i className="fa-solid fa-cloud-arrow-up"></i> Import
                        </button>
                        <button className="btn btn-light d-flex align-items-center gap-2">
                            <i className="fa-solid fa-cloud-arrow-down"></i> Export
                        </button>
                        {/* Add Product Button */}
                        <a
                            href="/add-product"
                            className="btn btn-light d-flex align-items-center gap-2"
                        >
                            <i className="fas fa-plus"></i> Add Product
                        </a>
                    </div>

                    {/* Search Input */}
                    <div className="search-box d-flex align-items-center">
                        <i className="fas fa-search text-light me-2"></i>
                        <input
                            type="text"
                            className="form-control border-0 bg-transparent text-light"
                            placeholder="Search product"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Table Section */}
        <div className="product-section px-0 px-md-0 px-lg-3 mt-5">
            <div className="container">
                <div className="card shadow-sm border-0 border-radius-12">
                    <div className="card-body p-4">
                        {/* Header Row */}
                        <div className="row align-items-center mb-3">
                            <div
                                className="col-12 col-lg-8 d-flex justify-content-between justify-content-lg-start mb-3 mb-lg-0">
                                <h5 className="fw-bold text-start">Product List</h5>
                                <button
                                    className="btn bg-disabled d-flex align-items-center ms-4"
                                // onClick={handleDelete}
                                >
                                    <i className="fas fa-trash"></i>{" "}
                                    <span className="ms-2">Delete</span>
                                </button>
                            </div>

                            <div className="col-12 col-lg-4 d-flex justify-content-end flex-wrap gap-2">
                                <div className="dropdown">
                                    <a
                                        className="nav-link custom-bg-primary text-white rounded px-3 py-2"
                                        id="FilterMenuLink"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Filter By <i className="fas fa-filter"></i>
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="FilterMenuLink">
                                        <li>
                                            <Link className="dropdown-item py-2" to={"/listproduct"}>
                                                All
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="dropdown-item py-2"
                                                to={"/listproduct?status=active"}
                                            >
                                                Active
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2"
                                                to={"/listproduct?status=Inactive"}
                                            >
                                                Inactive
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2"
                                                to={"/listproduct?status=Hidden"}
                                            >
                                                Hidden
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2"
                                                to={"/listproduct?status=Pending"}
                                            >
                                                Pending
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3">
                                            <input
                                                type="checkbox"
                                                id="select-all"
                                                className="custom-checkbox"
                                                onChange={handleSelectAll}
                                                checked={selectedItems.size === products.length}
                                            />
                                        </th>
                                        <th scope="col" className="py-3">
                                            Product ID
                                        </th>
                                        <th scope="col" className="py-3">
                                            Image
                                        </th>
                                        <th scope="col" className="py-3">
                                            Product Name
                                        </th>
                                        <th scope="col" className="py-3">
                                            Category
                                        </th>
                                        <th scope="col" className="py-3">
                                            Price
                                        </th>
                                        <th scope="col" className="py-3">
                                            Stock
                                        </th>
                                        <th scope="col" className="py-3">
                                            Sales
                                        </th>
                                        <th scope="col" className="py-3">
                                            Status
                                        </th>
                                        <th scope="col" className="py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (<tr key={product.productID}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="custom-checkbox row-checkbox"
                                                checked={selectedItems.has(product.productID)}
                                                onChange={() => handleSelectRow(product.productID)}
                                            />
                                        </td>
                                        <td>{product.productID}</td>
                                        <td>
                                            <img
                                                src={product.imageURL}
                                                alt="Product"
                                                className="p-img-thumbnail"
                                                width="50"
                                            />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{product.price}</td>
                                        <td>{product.stockQuantity}</td>
                                        <td>{product?.sales}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${product.status === "Active" ? "status-success" :
                                                        product.status === "Hidden" ? "status-warning" :
                                                            product.status === "Pending" ? "status-info" :
                                                                "status-danger"
                                                    }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm me-1"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <i className="fa-solid fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm me-1"
                                                onClick={() => confirmDelete(product)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>

                                            {product.status === "Hidden" ? (<button
                                                className="btn btn-sm"
                                                onClick={() => handleUnhide(product)}
                                                title="Hiện lại sản phẩm"
                                            >
                                                <i className="fa-solid fa-eye"></i>
                                            </button>) : (<button
                                                className="btn btn-sm"
                                                onClick={() => handleHide(product)}
                                                title="Ẩn sản phẩm"
                                            >
                                                <i className="fa-solid fa-eye-slash"></i>
                                            </button>)}
                                        </td>
                                    </tr>))}
                                </tbody>
                            </table>
                        </div>

                        {showEditModal && selectedProduct && (<EditProductModal
                            product={selectedProduct}
                            onClose={() => setShowEditModal(false)}
                            onSave={handleProductUpdate}
                        />)}

                        {showDeleteModal && productToDelete && (<PopupModal
                            show={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={handleDeleteConfirmed}
                            title="Xác nhận xoá"
                            body={`Bạn có chắc chắn muốn xoá sản phẩm "${productToDelete.name}"?`}
                            confirmText="Xoá"
                            cancelText="Huỷ"
                        />)}

                        {/* Pagination */}
                        <PaginationTab
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    </>);
};

export default ListProduct;