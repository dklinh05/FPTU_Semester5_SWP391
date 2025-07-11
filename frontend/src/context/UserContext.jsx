import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getTokenFromCookie } from "../services/authService";
import { getUserById } from "../services/userService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const initialToken = getTokenFromCookie() || localStorage.getItem("token");
    console.log("Initial token:", initialToken);
    return initialToken;
  });
  const [userId, setUserId] = useState(null);
  const [points, setPoints] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("UserContext useEffect: token =", token);
    if (token) {
      localStorage.setItem("token", token);
      try {
        const decoded = jwtDecode(token);
        console.log("UserContext: decoded =", decoded);
        if (decoded?.userId) {
          setUserId(decoded.userId);
          getUserById(decoded.userId)
            .then((data) => {
              console.log("UserContext: getUserById data =", data);
              setUser(data);
              setPoints(data.rewardPoints);
            })
            .catch((err) => {
              console.error("Lỗi lấy user:", err);
              setUserId(null);
              setUser(null);
              setPoints(null);
              setToken(null); // Clear token to force re-login
            });
        } else {
          console.log("UserContext: No userId in decoded token");
          setUserId(null);
          setUser(null);
          setPoints(null);
          setToken(null); // Clear token to force re-login
        }
      } catch (err) {
        console.error("Token không hợp lệ:", err);
        setUserId(null);
        setUser(null);
        setPoints(null);
        setToken(null); // Clear token to force re-login
      }
    } else {
      console.log("UserContext: No token, clearing state");
      setUserId(null);
      setUser(null);
      setPoints(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, userId, points }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);