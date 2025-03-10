"use client";
import { useAuth } from "@/context/AuthContext";

export default function RootLayout({ children }) {
    const { loggedIn, setLoggedIn } = useAuth();
    console.log(loggedIn);

    return (
        <>
            <div>{children}</div>
        </>
    );
}
