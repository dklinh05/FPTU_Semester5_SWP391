import {useEffect, useState} from "react";
import {useUser} from "../../context/UserContext";
import {renderCart} from "../../services/cartItemService";
import CartItem from "../../layouts/components/CartItem";
import CartTotal from "../../layouts/components/CartTotal";

function Cart() {
    const {userId} = useUser();
    const [carts, setCarts] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});

    const getCarts = async () => {
        try {
            const response = await renderCart(userId);
            setCarts(response);

            // Khởi tạo checkedItems mặc định là false
            const initialChecked = {};
            response.forEach((cart) => {
                initialChecked[cart.cartItemID] = false;
            });
            setCheckedItems(initialChecked);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        }
    };

    useEffect(() => {
        if (userId) {
            getCarts();
        }
    }, [userId]);

    const handleItemDeleted = () => {
        getCarts(); // gọi lại API để cập nhật
    };

    const handleCheckItem = (id, checked) => {
        setCheckedItems((prev) => ({
            ...prev,
            [id]: checked,
        }));
    };

    const isAllChecked =
        carts.length > 0 && carts.every((cart) => checkedItems[cart.cartItemID]);

    const handleCheckAll = (e) => {
        const checked = e.target.checked;
        const newChecked = {};
        carts.forEach((cart) => {
            newChecked[cart.cartItemID] = checked;
        });
        setCheckedItems(newChecked);
    };

    // Danh sách item được chọn (dựa trên checkedItems)
    const selectedItems = carts.filter((cart) => checkedItems[cart.cartItemID]);

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                {/* Table Responsive */}
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col" className="text-center align-middle">
                                <input
                                    type="checkbox"
                                    checked={isAllChecked}
                                    onChange={handleCheckAll}
                                    style={{transform: "scale(1.3)"}}
                                />
                            </th>
                            <th scope="col">Products</th>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Total</th>
                            <th scope="col">Handle</th>
                        </tr>
                        </thead>
                        <tbody>
                        {carts.map((cart) => (
                            <CartItem
                                key={cart.cartItemID}
                                id={cart.cartItemID}
                                quantity={cart.quantity}
                                img={cart.product.imageURL}
                                name={cart.product.name}
                                price={cart.product.price}
                                onDeleted={handleItemDeleted}
                                checked={checkedItems[cart.cartItemID] || false}
                                onCheck={(checked) =>
                                    handleCheckItem(cart.cartItemID, checked)
                                }
                            />
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Coupon Code */}
                <div className="mt-5">
                    <input
                        type="text"
                        className="border-0 border-bottom rounded me-5 py-3 mb-4"
                        placeholder="Coupon Code"
                    />
                    <button
                        className="btn border-secondary rounded-pill px-4 py-3 text-primary"
                        type="button"
                    >
                        Apply Coupon
                    </button>
                </div>

                {/* Cart Total - truyền selectedItems */}
                <CartTotal carts={selectedItems}/>
            </div>
        </div>
    );
}

export default Cart;
