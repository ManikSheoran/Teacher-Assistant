"use client";

import { useRouter } from "next/navigation";
import AboutComponent from "./AboutComponent";

export default function IntroComponent() {
    const router = useRouter();

    const scrollToAbout = () => {
        document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <div className="flex flex-col items-center min-h-screen justify-center w-full px-4 sm:px-6 lg:px-12 text-center">
                <div className="flex flex-col items-center p-6 text-black dark:text-[#F9E9EC] w-full max-w-7xl">
                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight w-full">
                        Effortless Grading, Deeper Insights, Better Learning
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl lg:text-2xl w-full">
                        Say goodbye to hours of manual grading. NeuroGrade's AI-powered assistant streamlines 
                        assessment, giving you faster results and deeper student insights.
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center mt-8 gap-4 sm:gap-6 w-full">
                    <button
                        onClick={() => router.push("/login")}
                        className="bg-[#1D2F6F] px-6 py-3 sm:px-8 sm:py-4 text-lg sm:text-xl lg:text-2xl rounded-full text-white transition-transform transform hover:scale-105"
                    >
                        Get Started
                    </button>
                    <button
                        onClick={scrollToAbout}
                        className="bg-[#F88DAD] px-6 py-3 sm:px-8 sm:py-4 text-lg sm:text-xl lg:text-2xl rounded-full text-white transition-transform transform hover:scale-105"
                    >
                        Learn More
                    </button>
                </div>
            </div>
            <div id="about-section" className="w-full">
                <AboutComponent />
            </div>
        </>
    );
}
