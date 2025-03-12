"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosLogOut } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import { getCookies, deleteCookie } from "cookies-next";
import { useAuth } from "@/context/AuthContext";
import Switch from "@mui/material/Switch";
import { useDarkMode } from "@/context/DarkModeContext";
import { useUser } from "@/context/UserContext";

const Header = () => {
    const { loggedIn, setLoggedIn } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, setUser } = useUser();
    const { darkMode, setDarkMode } = useDarkMode();

    const checkAuthStatus = async () => {
        let cookies = getCookies();
        if (cookies.uid) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, [loggedIn]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const collapseMenu = () => {
        setMenuOpen(false)
    }

    const handleLogout = () => {
        deleteCookie("uid");
        setLoggedIn(false);
        setUser({});
        collapseMenu()
    };
    return (
        <nav className="fixed top-0 left-0 w-full dark:bg-[#1D2F6F] bg-[#8390FA] shadow-md h-16 flex items-center px-6 justify-between z-50">
            {/* Website Name */}
            <div className="text-2xl font-bold dark:text-[#F9E9EC] text-black">
                <Link href="/">NeuroGrade</Link>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center mr-4">
                <div className="flex items-center mr-4">
                    <Switch
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                        color="default"
                    />
                    <span className="ml-2 text-[#F9E9EC]">
                        {darkMode ? "🌙" : "☀️"}
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    {loggedIn ? (
                        <>
                            <span className="dark:text-[#F9E9EC] text-black">
                                Hello, {user.name || "User"}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center dark:text-[#FAC748] dark:hover:text-[#ffd97a] text-[#1D2F6F] hover:text-[#1c40cd]"
                            >
                                <IoIosLogOut className="text-2xl mr-1" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-row space-x-2 font-bold">
                            <Link href="/login">
                                <button className="w-24 px-4 py-2 bg-[#FAC748] text-[#1D2F6F] rounded-md hover:bg-[#ffd97a] text-center">
                                    Login
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="w-24 px-4 py-2 bg-[#FAC748] text-[#1D2F6F] rounded-md hover:bg-[#ffd97a] text-center">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* 🔹 Mobile Menu Toggle */}
                <div className="md:hidden">
                    {menuOpen ? (
                        <FiX
                            className="text-3xl cursor-pointer dark:text-[#F9E9EC] text-black"
                            onClick={() => setMenuOpen(false)}
                        />
                    ) : (
                        <FiMenu
                            className="text-3xl cursor-pointer dark:text-[#F9E9EC] text-black"
                            onClick={() => setMenuOpen(true)}
                        />
                    )}
                </div>
            </div>
            {/* 🔹 Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="absolute top-16 left-0 w-full dark:bg-[#1D2F6F] bg-[#8390FA] shadow-md flex flex-col items-center space-y-4 py-4">
                    {loggedIn ? (
                        <>
                            <span className="text-[#F9E9EC]">
                                Hello, {user.name || "User"}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-[#FAC748] hover:text-[#ffd97a]"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col space-y-4 w-full mx-10 items-center font-bold">
                                <Link href="/login">
                                    <button
                                        onClick={collapseMenu}
                                        className="w-40 px-4 py-2 bg-[#FAC748] text-[#1D2F6F] rounded-md hover:bg-[#ffd97a] text-center"
                                    >
                                        Login
                                    </button>
                                </Link>
                                <Link href="/register">
                                    <button
                                        onClick={collapseMenu}
                                        className="w-40 px-4 py-2 bg-[#FAC748] text-[#1D2F6F] rounded-md hover:bg-[#ffd97a] text-center"
                                    >
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Header;
