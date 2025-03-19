"use client"
import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false)
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/fetch`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                if (response.ok) {
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error("Error verifying user:", error);
            }
        };
        checkLoggedIn();
    },[])
    return (
        <AuthContext.Provider value={{loggedIn, setLoggedIn}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)