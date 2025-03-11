"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/elements/header";
import { setCookie } from "cookies-next";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [backendError, setBackendError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
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

        const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`;

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            console.log(response);
            console.log(response.status);
            if (response.status === 201) {
                router.push("/login");
            } else {
                setBackendError("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setBackendError(
                "An error occurred during registration. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center m-16 mt-40">
                <div className="bg-[#F9E9EC] dark:bg-[#1D2F6F] shadow-md rounded-lg p-8 max-w-md w-full">
                    <h1 className="text-2xl font-bold text-[#1D2F6F] dark:text-[#F9E9EC] mb-6 text-center">
                        Register
                    </h1>
                    {backendError && (
                        <p className="text-red-500 text-sm mb-4 text-center">
                            {backendError}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 ${
                                    errors.name
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-[#8390FA] dark:border-[#F88DAD] focus:ring-[#1D2F6F] dark:focus:ring-[#FAC748]"
                                }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 ${
                                    errors.email
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-[#8390FA] dark:border-[#F88DAD] focus:ring-[#1D2F6F] dark:focus:ring-[#FAC748]"
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
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 ${
                                    errors.password
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-[#8390FA] dark:border-[#F88DAD] focus:ring-[#1D2F6F] dark:focus:ring-[#FAC748]"
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
                            className={`w-full py-3 bg-[#1D2F6F] text-white dark:text-[#1D2F6F] font-bold rounded-lg hover:bg-[#1c40cd] dark:hover:bg-[#fadf9d] dark:bg-[#FAC748] transition duration-300 ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isLoading ? "Registering..." : "Register"}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <a
                            href="/login"
                            className="text-[#1D2F6F] dark:text-[#FAC748] font-medium hover:text-[#1c40cd] dark:hover:text-[#fadf9d] transition duration-300"
                        >
                            Existing User? Login
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
