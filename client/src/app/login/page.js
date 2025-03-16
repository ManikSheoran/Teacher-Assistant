"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [backendError, setBackendError] = useState("");
    const { setLoggedIn } = useAuth();
    const { setUser } = useUser();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
        if (!formData.password) newErrors.password = "Password is required";
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

        const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`;
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const fetchUser = async (uid) => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/fetch`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid }),
                });
                return await res.json();
            };

            const data = await response.json();
            if (response.ok) {
                setCookie("token", data.token.accessToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: data.token.expiresIn });
                setCookie("uid", data.uid, { secure: true, sameSite: "strict" });
                setLoggedIn(true);
                const currUser = await fetchUser(data.uid);
                if (currUser) setUser(currUser);
                router.push("/");
            } else {
                setBackendError(data.error || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setBackendError("An error occurred while logging in. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-sky-100 dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all">
                {/* Card */}
                <div className="bg-sky-100 dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="relative h-28 bg-gradient-to-r from-[#1D2F6F] to-[#3D5BF5] dark:from-[#283A6D] dark:to-[#5B7BFF] pt-6">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white"></div>
                            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white"></div>
                        </div>
                        <h1 className="text-2xl font-bold text-white text-center">Welcome Back</h1>
                        <p className="text-[#F9E9EC] text-center mt-2 opacity-80">Sign in to your account</p>
                    </div>

                    {/* Form */}
                    <div className="px-6 py-8">
                        {backendError && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
                                <p className="text-red-600 dark:text-red-400 text-sm text-center">{backendError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className={`w-full px-4 py-3 rounded-lg border ${
                                            errors.email
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 dark:border-gray-600 focus:border-[#1D2F6F] dark:focus:border-[#FAC748]"
                                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-sm text-[#1D2F6F] dark:text-[#FAC748] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-3 rounded-lg border ${
                                            errors.password
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 dark:border-gray-600 focus:border-[#1D2F6F] dark:focus:border-[#FAC748]"
                                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full h-14 flex items-center justify-center px-4 bg-gradient-to-r from-[#1D2F6F] to-[#3D5BF5] dark:from-[#FAC748] dark:to-[#FFD97D] text-white dark:text-gray-800 font-semibold rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1D2F6F]/50 dark:focus:ring-[#FAC748]/50 ${
                                    isLoading
                                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                        : "bg-[#1D2F6F] dark:bg-[#FAC748] dark:text-gray-900 hover:bg-[#162554] dark:hover:bg-[#f8be2a] shadow-md hover:shadow-lg"
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white dark:text-gray-900" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>

                            <div className="mt-4 text-center dark:text-gray-400">
                                New User?{" "}
                                <a href="/register" className="text-[#1D2F6F] dark:text-[#FAC748] font-medium hover:text-[#1c40cd] dark:hover:text-[#fadf9d] transition duration-300">
                                    Register
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}