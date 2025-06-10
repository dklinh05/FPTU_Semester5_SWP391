import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getTokenFromCookie } from "../services/authService";
import { getUserById } from "../services/userService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  
  const storedToken = localStorage.getItem("token");

  const [token, setToken] = useState(storedToken || null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded?.userId) {
          setUserId(decoded.userId);
          getUserById(decoded.userId)
            .then((data) => setUser(data))
            .catch((err) => console.error("Lỗi lấy user:", err));
        }
      } catch (err) {
        console.error("Token không hợp lệ:", err);
        setUserId(null);
        setUser(null);
      }
    } else {
       const token = getTokenFromCookie();
       localStorage.setItem("token", token)
    }
  }, [storedToken]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, userId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
