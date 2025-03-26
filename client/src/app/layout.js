"use client";
import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { FiMessageSquare, FiMail, FiMapPin } from "react-icons/fi"; 
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
                <link rel="manifest" href="./manifest.js" />
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
                    {/* Footer Section */}
                    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 pt-8 px-6 shadow-2xl relative">
                    <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Neurograde Section */}
                        <div className="space-y-4 text-left">
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">
                            Neurograde
                        </h2>
                        <p className="leading-relaxed text-gray-300 mb-4">
                            Neurograde is an innovative AI-powered platform transforming educational assessment 
                            through intelligent, personalized learning analytics and evaluation technologies.
                        </p>
                        <Link href="#" className="inline-block text-blue-400 hover:text-blue-300 transition">
                            Get Started →
                        </Link>
                        </div>

                        {/* Quick Links Section */}
                        <div className="hidden md:block space-y-4 text-left md:pl-16">
                        <h3 className="text-xl font-bold text-blue-400">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                            <Link href="#" className="text-gray-300 hover:text-white transition">
                                Home
                            </Link>
                            </li>
                            <li>
                            <Link href="#" className="text-gray-300 hover:text-white transition">
                                Learn More
                            </Link>
                            </li>
                            <li>
                            <Link href="#" className="text-gray-300 hover:text-white transition">
                                Our Team
                            </Link>
                            </li>
                        </ul>
                        </div>

                        {/* Contact Information Section */}
                        <div className="space-y-6 text-left">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 flex-shrink-0">
                                    <FiMapPin size={18} className="text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-blue-300">Location</h3>
                                    <p className="text-gray-300">
                                        Indian Institute of Engineering Science and Technology, Shibpur, West Bengal
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 flex-shrink-0">
                                    <FiMail size={18} className="text-red-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-blue-300">Email</h3>
                                    <a 
                                        href="mailto:contact@neurograde.app" 
                                        className="transition-colors duration-300 text-gray-200 hover:text-white"
                                    >
                                        contact@neurograde.app
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider and Copyright */}
                    <div className="text-center mt-6 mb-4 text-gray-400">
                        <div className="h-0.5 w-3/5 mx-auto mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                        © {new Date().getFullYear()} Neurograde. All Rights Reserved.
                    </div>
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
