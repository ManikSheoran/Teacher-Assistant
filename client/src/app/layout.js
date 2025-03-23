"use client";
import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { FiMessageSquare } from "react-icons/fi"; // Import an icon for the feedback button
import Header from "../components/elements/Header";
import "./globals.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Background from "@/components/Background";
import { DarkModeProvider, useDarkMode } from "@/context/DarkModeContext";
import { UserProvider } from "@/context/UserContext";
import Link from "next/link";

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
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
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
                    content="https://www.neurograde.app/favicon.ico"
                />
                <meta name="robots" content="index, follow" />
            </head>
            <body className={`${theme}-mode quicksand ${theme} relative`}>
                <Background />
                <div className="min-h-screen flex flex-col">
                    <Header dashboard={true} />
                    <main className="flex-grow">{children}</main>
                    <footer className="select-none bg-black text-white text-center py-4">
                        &copy; {new Date().getFullYear()} NeuroGrade. All rights
                        reserved.
                    </footer>

                    {showScrollButton && (
                        <>
                            {/* Scroll Up Button */}
                            <div className="fixed bottom-8 right-8">
                                <button
                                    onClick={scrollUp}
                                    className={`p-3 rounded-full shadow-lg transition ${
                                        darkMode
                                            ? "bg-gray-800 text-white hover:bg-gray-700"
                                            : "bg-gray-200 text-black hover:bg-gray-300"
                                    }`}
                                    title="Scroll to Top"
                                >
                                    <ChevronUp size={24} />
                                </button>
                            </div>

                            {/* Feedback Button */}
                            <div className="fixed bottom-8 left-8">
                                <Link href="/userfeedback">
                                    <button
                                        className={`p-3 rounded-full shadow-lg transition flex items-center justify-center ${
                                            darkMode
                                                ? "bg-primary text-secondary hover:bg-blue-500"
                                                : "bg-secondary text-primary hover:bg-blue-400"
                                        }`}
                                        title="Give Feedback"
                                    >
                                        <FiMessageSquare size={24} />
                                    </button>
                                </Link>
                            </div>
                        </>
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
