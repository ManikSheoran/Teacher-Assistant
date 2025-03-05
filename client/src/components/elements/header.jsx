"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosLogOut } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi"; // Mobile menu icons
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const auth = getAuth();

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setUserName(user.displayName || user.email); // Use displayName or fallback to email
      } else {
        setLoggedIn(false);
        setUserName("");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setLoggedIn(false);
      setMenuOpen(false); // Close menu after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md h-16 flex items-center px-6 justify-between z-50">
      {/* 🔹 Website Name */}
      <div className="text-2xl font-bold text-green-600">
        <Link href="/">Teacher Assistant</Link>
      </div>

      {/* 🔹 Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {loggedIn ? (
          <>
            <span className="text-green-600">Hello, {userName || "User"}</span>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <IoIosLogOut className="text-2xl mr-1" />
              Logout
            </button>
          </>
        ) : (
          <div className="flex flex-row space-x-2">
            <Link href="/login">
              <button className="w-24 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="w-24 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center">
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
            className="text-3xl cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />
        ) : (
          <FiMenu
            className="text-3xl cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        )}
      </div>

      {/* 🔹 Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4">
          {loggedIn ? (
            <>
              <span className="text-green-600">
                Hello, {userName || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button
                  className="w-24 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button
                  className="w-24 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
