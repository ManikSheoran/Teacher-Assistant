"use client";
import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUserState] = useState({});

    // Load user data from localStorage on initial mount
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("userData");
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUserState(parsedUser);
            }
        } catch (error) {
            console.error("Failed to load user data from localStorage:", error);
        }
    }, []);

    // Wrapper function to update both state and localStorage
    const setUser = (userData) => {
        setUserState(userData);
        try {
            // Only save non-empty objects to localStorage
            if (userData && Object.keys(userData).length > 0) {
                localStorage.setItem("userData", JSON.stringify(userData));
            } else {
                // If user is empty (logged out), clear localStorage
                localStorage.removeItem("userData");
            }
        } catch (error) {
            console.error("Failed to save user data to localStorage:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
