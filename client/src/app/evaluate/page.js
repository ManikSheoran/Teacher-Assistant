"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/elements/Header";
import fetchUserUID from "@/lib/fetchUserUID";

export default function Home() {
    const router = useRouter();
    const [sid, setSid] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (sid) {
            router.push(`/student/${sid}/evaluate`);
        } else {
            alert("Please enter a student ID");
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetchUserUID();
                if (!response) {
                    router.push("/login");
                    alert("You need to login first");
                }
            } catch (error) {
                console.error("Error validating uid:", error);
                router.push("/login");
                alert("You need to login first");
            }
        };
        checkAuth();
    }, [router]);

    return (
        <>
            <Header />
            <main className="pt-20 px-4 min-h-screen flex flex-col items-center justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-sky-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700"
                >
                    <h1 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">
                        Enter Student ID
                    </h1>
                    <div className="mb-4">
                        <label
                            htmlFor="sid"
                            className="block text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Student ID
                        </label>
                        <input
                            type="text"
                            id="sid"
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary"
                            value={sid}
                            onChange={(e) => setSid(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary dark:bg-secondary text-white py-3 px-4 rounded-lg hover:bg-secondary dark:hover:bg-primary transition duration-300 text-lg font-medium"
                    >
                        Continue
                    </button>
                </form>
            </main>
        </>
    );
}
