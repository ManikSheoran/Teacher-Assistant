"use client";
import React from "react";
import Header from "../components/elements/header";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Background from "@/components/Background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Layout = ({ children }) => {
  const metadata = {
    title: "NeuroGrade",
    description: "A simple web app to help teachers grade students.",
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="light-mode quicksand">
        <Background />
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <footer className="bg-black text-white text-center py-4">
              &copy; {new Date().getFullYear()} NeuroGrade. All rights reserved.
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
};

export default Layout;