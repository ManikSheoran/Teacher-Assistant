"use client";
import React from "react";
import Header from "../components/elements/header";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Background from "@/components/Background";
import { DarkModeProvider, useDarkMode } from "@/context/DarkModeContext";

function ThemedLayout({ children }) {
    const { darkMode } = useDarkMode();
    const theme = darkMode ? "dark" : "light";

    return (
        <body className={`${theme}-mode quicksand ${theme}`}>
            <Background />
            <AuthProvider>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow">{children}</main>
                    <footer className="bg-black text-white text-center py-4">
                        &copy; {new Date().getFullYear()} NeuroGrade. All rights
                        reserved.
                    </footer>
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
        <html
            lang="en"
        >
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
