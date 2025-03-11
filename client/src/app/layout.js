"use client";
import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react"; 
import Header from "../components/elements/header";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Background from "@/components/Background";
import { DarkModeProvider, useDarkMode } from "@/context/DarkModeContext";
import { getCookie } from "cookies-next";

function ThemedLayout({ children }) {
    const { darkMode, isThemeLoaded } = useDarkMode();
    const theme = darkMode ? "dark" : "light";
    const [showScrollButton, setShowScrollButton] = useState(false);

    // if (!isThemeLoaded) {
    //     return (
    //         <body>
    //             <div style={{ visibility: "hidden" }}>{children}</div>
    //         </body>
    //     )
    // }

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 200); 
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollUp = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <body className={`${theme}-mode quicksand ${theme} relative`}>
            <Background />
            <AuthProvider>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow">{children}</main>
                    <footer className="bg-black text-white text-center py-4">
                        &copy; {new Date().getFullYear()} NeuroGrade. All rights reserved.
                    </footer>
                    
                    {showScrollButton && (
                        <button
                            onClick={scrollUp}
                            className="fixed bottom-8 right-8 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition"
                        >
                            <ChevronUp size={24} />
                        </button>
                    )}
                </div>
            </AuthProvider>
        </body>
    );
}

const Layout = ({ children }) => {
    const metadata = {
        title: "NeuroGrade",
        description: "A simple web app to help teachers grade students.",
    };

    return (
        <html lang="en">
            <head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </head>
            <DarkModeProvider>
                <ThemedLayout>{children}</ThemedLayout>
            </DarkModeProvider>
        </html>
    );
};

export default Layout;
