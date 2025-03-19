"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import FormComponent from "../../../../components/FormComponent";
import Header from "../../../../components/elements/Header";
import fetchUserUID from "@/lib/fetchUserUID";

export default function EvaluatePage() {
    const { sid } = useParams();
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

    return (
        <>
            <Header />
            <main className="pt-20 px-4 bg-transparent min-h-screen flex flex-col items-center">
                {/* Title - Centered */}
                <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary mb-6 text-center">
                    Evaluating Student: {sid}
                </h1>

                {/* FormComponent - Responsive */}
                <div className="w-full max-w-3xl">
                    <FormComponent sid={sid} readOnly={true} />
                </div>
            </main>
        </>
    );
}
