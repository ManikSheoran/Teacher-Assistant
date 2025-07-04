"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [role, setRole] = useState("student");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [backendError, setBackendError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { loggedIn, setLoggedIn } = useAuth();
    const { setUser, fetchUserData } = useUser();

    useEffect(() => {
        console.log("Auth state changed:", loggedIn);
        if (loggedIn) {
            router.push("/");
        }
    }, [loggedIn, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        setIsLoading(true);
        setBackendError("");

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        try {
            // Use the correct endpoint based on role
            const endpoint =
                role === "teacher"
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/teacher/login`
                    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/student/login`;

            // Only send email and password
            const payload = { email: formData.email, password: formData.password };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setLoggedIn(true);
                await fetchUserData(); // <-- Fetch and set user data after login
                router.push("/dashboard");
            } else {
                setBackendError(data.error || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setBackendError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <style jsx global>{`
                ::-ms-reveal {
                    display: none;
                }
            `}</style>
            <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-sky-100 dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all">
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
                                {/* Role selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Login as
                                    </label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                </div>
                                {/* Removed roll number input */}
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
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            className={`w-full px-4 py-3 rounded-lg border ${
                                                errors.password
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 dark:border-gray-600 focus:border-[#1D2F6F] dark:focus:border-[#FAC748]"
                                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                                        />
                                        {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                                        {formData.password && (
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute inset-y-0 right-3 flex items-center focus:outline-none"
                                            >
                                                {showPassword ? (<FaEyeSlash className="text-gray-500" />) : (<FaEye className="text-gray-500" />)}
                                            </button>
                                        )}
                                    </div>
                                    <Link href="" className=" text-sm text-[#1D2F6L] dark:text-[#FAC748] hover:underline block text-right mt-1">
                                        Forgot password?
                                    </Link>
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

                                <div className="mt-4 text-center text-black dark:text-gray-400">
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
        </>
    );
}