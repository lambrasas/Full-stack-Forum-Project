import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const persistedUser = localStorage.getItem("user");
    return persistedUser ? JSON.parse(persistedUser) : null;
  });

  const loginUser = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const userData = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return true;
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      localStorage.removeItem("user");
      setUser(null);
      return false;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
