"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useUser } from "@/context/UserContext";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [backendError, setBackendError] = useState("");
    const { loggedIn, setLoggedIn } = useAuth();
    const { user, setUser } = useUser();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        <div className="flex items-center justify-center px-4 sm:px-8 lg:px-0 min-h-screen">
            <div className="bg-[#F9E9EC] dark:bg-[#1D2F6F] shadow-md rounded-lg p-6 sm:p-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
                <h1 className="text-2xl font-bold text-[#1D2F6F] dark:text-[#F9E9EC] mb-6 text-center">Login</h1>
                {backendError && <p className="text-red-500 text-sm mb-4 text-center">{backendError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 
                                ${errors.email ? "border-red-500 focus:ring-red-500" : "border-[#8390FA] dark:border-[#F88DAD] focus:ring-[#1D2F6F] dark:focus:ring-[#FAC748]"}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 
                                ${errors.password ? "border-red-500 focus:ring-red-500" : "border-[#8390FA] dark:border-[#F88DAD] focus:ring-[#1D2F6F] dark:focus:ring-[#FAC748]"}`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 bg-[#1D2F6F] text-white dark:text-[#1D2F6F] font-bold rounded-lg hover:bg-[#1c40cd] dark:hover:bg-[#fadf9d] dark:bg-[#FAC748] transition duration-300 
                            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a href="/register" className="text-[#1D2F6F] dark:text-[#FAC748] font-medium hover:text-[#1c40cd] dark:hover:text-[#fadf9d] transition duration-300">
                        New User? Register
                    </a>
                </div>
            </div>
        </div>
    );
}
