"use client";

import { useParams } from "next/navigation";
import Feedback from "../../../../components/Feedback";
import { useRouter } from "next/navigation";
import Header from "../../../../components/elements/Header";
import { useEffect, useState } from "react";
import fetchUserUID from "@/lib/fetchUserUID";

export default function FeedbackPage() {
    const { sid } = useParams();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${sid}/feedbacks`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();
                if (Array.isArray(data)) {
                    setFeedbacks(data);
                } else {
                    console.error("Invalid data format:", data);
                    setFeedbacks([]);
                }
            } catch (error) {
                console.error("Error fetching feedback list:", error);
                setFeedbacks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sid]);

    return (
        <>
            <Header />
            <main className="pt-20 px-4 min-h-screen flex flex-col items-center">
                {/* Title - Responsive Centered */}
                <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary mb-6 text-center">
                    Feedbacks for {sid}
                </h1>

                {loading ? (
                    <div className="flex flex-col items-center justify-center mt-10">
                        <div className="relative w-16 h-16">
                            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-r-transparent border-b-secondary border-l-transparent animate-spin"></div>
                            <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-t-transparent border-r-secondary border-b-transparent border-l-primary animate-spin animate-reverse"></div>
                        </div>
                        <p className="text-gray-400 mt-4">Loading feedbacks...</p>
                    </div>
                ) : feedbacks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 w-full max-w-5xl">
                        {feedbacks.slice().reverse().map((feedback, index) => (
                            <div key={index} className="p-2">
                                <Feedback feedback={feedback} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-lg col-span-full text-center">
                        No feedbacks found.
                    </p>
                )}
            </main>
        </>
    );
}
