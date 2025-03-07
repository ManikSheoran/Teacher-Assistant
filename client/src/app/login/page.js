"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/elements/header";
import { setCookie } from "cookies-next";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [backendError, setBackendError] = useState("");
    const {loggedIn, setLoggedIn} = useAuth();
    console.log(`Logged in? ${loggedIn}`);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        setBackendError("");
        setIsLoading(true);

        const endpoint = "http://localhost:8000/user/login";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                // Save token in an HTTP-only cookie
                setCookie("token", data.token.accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: data.token.expiresIn,
                });
                setCookie("uid", data.uid, {
                    secure: true,
                    sameSite: "strict",
                });
                setLoggedIn(true);
                router.push("/");
            } else {
                setBackendError(
                    data.error || "Login failed. Please try again."
                );
            }
        } catch (error) {
            console.error("Error:", error);
            setBackendError(
                "An error occurred while logging in. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="flex items-center justify-center m-16 mt-40">
                <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                    <h1 className="text-2xl font-bold text-[#44546a] mb-6 text-center">
                        Login
                    </h1>
                    {backendError && (
                        <p className="text-red-500 text-sm mb-4 text-center">
                            {backendError}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 ${
                                    errors.email
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-[#00ff06] focus:ring-[#00cc47]"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 ${
                                    errors.password
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-[#00ff06] focus:ring-[#00cc47]"
                                }`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 bg-[#71c479] text-white font-bold rounded-lg hover:bg-[#00cc47] transition duration-300 ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <a
                            href="/register"
                            className="text-[#71c479] font-medium hover:text-[#00ff06] transition duration-300"
                        >
                            New User? Register
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
