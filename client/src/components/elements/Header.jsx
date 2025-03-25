"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosLogOut } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Switch from "@mui/material/Switch";
import { useDarkMode } from "@/context/DarkModeContext";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

const Header = () => {
  const { loggedIn, setLoggedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();
  const { user, setUser } = useUser();
  const [dashboard, setDashboard] = useState(false);

  const pathname = usePathname();
  useEffect(() => {
    setDashboard(pathname === "/dashboard");
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const collapseMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        setLoggedIn(false);
        setUser({});
      } else {
        console.error("Error logging out:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    collapseMenu();
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full shadow-md h-16 flex items-center md:px-6 px-3 justify-between z-50 ${
        darkMode ? "bg-[#1D2F6F] text-white" : "bg-[#8390FA] text-black"
      }`}
    >
      {/* Website Name */}
      <div className="text-2xl font-bold dark:text-[#F9E9EC] text-black">
        <Link href="/" onClick={collapseMenu}>
          <div className="flex items-center space-x-2 cursor-pointer">
            <img
              src={`/logo-${darkMode ? "dark" : "light"}.svg`}
              alt="NeuroGrade Logo"
              className="h-8"
            />
            <h2>NeuroGrade</h2>
          </div>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
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

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          className={`absolute top-16 left-0 w-full shadow-md flex flex-col items-center space-y-4 py-4 ${
            darkMode ? "bg-[#1D2F6F] text-white" : "bg-[#8390FA] text-black"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              color="default"
            />
            <span>{darkMode ? "🌙" : "☀️"}</span>
          </div>
          {loggedIn ? (
            <>
              <span className={`${darkMode ? "text-[#F9E9EC]" : "text-black"}`}
              >
                Hello, {user.name || "User"}
              </span>
              {!dashboard && (
                <Link href="/dashboard">
                  <button
                    onClick={collapseMenu}
                    className="w-40 px-4 py-2 bg-[#FAC748] rounded-md hover:bg-[#ffd97a] text-center"
                  >
                    Dashboard
                  </button>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-[#FAC748] hover:text-[#ffd97a]"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-4 w-full mx-10 items-center font-bold">
              <Link href="/login">
                <button
                  onClick={collapseMenu}
                  className="w-40 px-4 py-2 bg-[#FAC748] rounded-md hover:bg-[#ffd97a] text-center"
                >
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button
                  onClick={collapseMenu}
                  className="w-40 px-4 py-2 bg-[#FAC748] rounded-md hover:bg-[#ffd97a] text-center"
                >
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            color="default"
          />
          <span>{darkMode ? "🌙" : "☀️"}</span>
        </div>
        {loggedIn ? (
          <>
            <span className={`${darkMode ? "text-[#F9E9EC]" : "text-black"}`}
            >
              Hello, {user.name || "User"}
            </span>
            {!dashboard && (
              <Link href="/dashboard">
                <button
                  onClick={collapseMenu}
                  className="w-40 px-4 py-2 bg-[#FAC748] rounded-md hover:bg-[#ffd97a] text-center"
                >
                  Dashboard
                </button>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center text-[#FAC748] hover:text-[#ffd97a]"
            >
              <IoIosLogOut className="text-2xl mr-1 text-[#FAC748] hover:text-[#ffd97a]" />
              Logout
            </button>
          </>
        ) : (
          <div className="flex flex-row space-x-2 font-bold">
            <Link href="/login">
              <button className="w-40 px-4 py-2 bg-[#FAC748] text-[#1D2F6F] rounded-md hover:bg-[#ffd97a] text-center">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="w-40 px-4 py-2 bg-[#FAC748] text-[#1D2F6F] rounded-md hover:bg-[#ffd97a] text-center">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
