import { createContext, useContext, useEffect, useState } from 'react';
import { getUserById } from '../services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user');
    if (storedUserId) {
      getUserById(storedUserId)
        .then(data => setUser(data))
        .catch(err => console.error('Lỗi lấy user:', err));
    }
  }, [[location.search]]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
