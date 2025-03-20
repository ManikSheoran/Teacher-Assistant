"use client";
import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import Header from "../components/elements/Header";
import "./globals.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Background from "@/components/Background";
import { DarkModeProvider, useDarkMode } from "@/context/DarkModeContext";
import { UserProvider } from "@/context/UserContext";

function ThemedLayout({ children }) {
    const { darkMode } = useDarkMode();
    const theme = darkMode ? "dark" : "light";
    const [showScrollButton, setShowScrollButton] = useState(false);
    const { loggedIn } = useAuth();

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
        <>
            <head>
                <title>
                    {loggedIn
                        ? "Dashboard - NeuroGrade"
                        : "Welcome to NeuroGrade"}
                </title>
                <meta
                    name="description"
                    content={
                        loggedIn
                            ? "Access your AI-powered grading dashboard."
                            : "NeuroGrade helps teachers automate grading and provide personalized feedback."
                    }
                />
                <meta
                    name="keywords"
                    content="AI grading, automated feedback, teacher assistant, student evaluation"
                />
                <meta
                    property="og:title"
                    content={
                        loggedIn
                            ? "Dashboard - NeuroGrade"
                            : "Welcome to NeuroGrade"
                    }
                />
                <meta
                    property="og:description"
                    content={
                        loggedIn
                            ? "Access your AI-powered grading dashboard."
                            : "NeuroGrade helps teachers automate grading and provide personalized feedback."
                    }
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.neurograde.app/" />
                <meta
                    property="og:image"
                    content="https://www.neurograde.app/favicon-32x32.png"
                />
                <meta name="robots" content="index, follow" />
            </head>
            <body className={`${theme}-mode quicksand ${theme} relative`}>
                <Background />
                <div className="min-h-screen flex flex-col">
                    <Header dashboard={true}/>
                    <main className="flex-grow">{children}</main>
                    <footer className="select-none bg-black text-white text-center py-4">
                        &copy; {new Date().getFullYear()} NeuroGrade. All
                        rights reserved.
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
            </body>
        </>
    );
}

const Layout = ({ children }) => {
    return (
        <html lang="en">
            <DarkModeProvider>
                <AuthProvider>
                    <UserProvider>
                        <ThemedLayout>{children}</ThemedLayout>
                    </UserProvider>
                </AuthProvider>
            </DarkModeProvider>
        </html>
    );
};

export default Layout;
