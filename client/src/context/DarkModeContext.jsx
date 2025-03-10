"use client";
import { createContext, useState, useContext, useEffect } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    // Initialize as null (not rendering until we know the actual value)
    const [darkMode, setDarkMode] = useState(null);
    const [mounted, setMounted] = useState(false);

    // On mount, check localStorage for saved preference
    useEffect(() => {
        // Get saved mode from localStorage
        const savedMode = localStorage.getItem("darkMode");

        // If a value exists in localStorage, use it
        if (savedMode !== null) {
            setDarkMode(savedMode === "true");
        } else {
            // Optional: Check user's system preference
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            setDarkMode(prefersDark);
            localStorage.setItem("darkMode", prefersDark.toString());
        }

        setMounted(true);
    }, []);

    // Function to toggle dark mode and save to localStorage
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", newMode.toString());
    };

    // Allow direct setting of mode (also saves to localStorage)
    const setDarkModeWithStorage = (value) => {
        setDarkMode(value);
        localStorage.setItem("darkMode", value.toString());
    };

    // Provide both the state and the functions to change it
    return (
        <DarkModeContext.Provider
            value={{
                darkMode: darkMode === null ? false : darkMode,
                isThemeLoaded: darkMode !== null,
                setDarkMode: setDarkModeWithStorage,
                toggleDarkMode,
                mounted, // Expose mounted state to prevent hydration mismatch
            }}
        >
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);
