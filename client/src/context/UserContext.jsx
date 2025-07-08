"use client";
import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState({});

  // Fetch user data from backend
  const fetchUserData = async () => {
    try {
      // Try student endpoint first
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/student/data`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setUserState(data);
        localStorage.setItem("userData", JSON.stringify(data));
        return;
      }
      // If not student, try teacher endpoint
      res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/teacher/data`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUserState(data);
        localStorage.setItem("userData", JSON.stringify(data));
        return;
      }
      // If neither, clear user
      setUserState({});
      localStorage.removeItem("userData");
    } catch (error) {
      setUserState({});
      localStorage.removeItem("userData");
      console.error("Failed to fetch user data from backend:", error);
    }
  };

  // On mount, try to fetch user data from backend (session/cookie)
  useEffect(() => {
    fetchUserData();
  }, []);

  // Wrapper function to update both state and localStorage
  const setUser = (userData) => {
    setUserState(userData);
    try {
      if (userData && Object.keys(userData).length > 0) {
        localStorage.setItem("userData", JSON.stringify(userData));
        if (userData.roll) {
          localStorage.setItem("student_roll", userData.roll);
        } else {
          localStorage.removeItem("student_roll");
        }
      } else {
        localStorage.removeItem("userData");
        localStorage.removeItem("student_roll");
      }
    } catch (error) {
      console.error("Failed to save user data to localStorage:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
