import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import {
  renderCart,
  addProductToCart,
  deleteCartItem,
  updateQuantityCart,
} from "../services/cartItemService"; // Gọi đúng API backend bạn viết

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { userId } = useUser();
  const [carts, setCarts] = useState([]);
  const [reload, setReload] = useState({});
  const [cartsLength, setCartsLength] = useState([]);

  useEffect(() => {
    if (userId) {
      renderCart(userId).then((data) => {
        setCarts(data);
        setCartsLength(data.length);
      });
    }
  }, [userId, reload]);

  // const clearCart = async () => {
  //   await clearCartDB(userId);
  //   setCarts([]);
  // };

  return (
    <CartContext.Provider value={{ carts, cartsLength, setReload }}>
      {children}
    </CartContext.Provider>
  );
};
