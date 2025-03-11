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
            <div className="flex flex-col items-center min-h-screen justify-center">
                <div className="flex flex-col items-center p-6 text-black dark:text-[#F9E9EC] w-full justify-center">
                    <h1 className="lg:text-7xl sm:text-4xl text-center font-bold lg:mx-10">
                        Effortless Grading, Deeper Insights, Better Learning
                    </h1>
                    <p className="text-center mt-10 sm:text-xl lg:text-2xl lg:mx-10">
                        Say goodbye to hours of manual grading. NeuroGrade's
                        AI-powered assistant streamlines assessment, giving you
                        faster results and deeper student insights.
                    </p>
                </div>
                <div className="flex flex-row items-center justify-center mt-8">
                    <button
                        onClick={() => router.push("/login")}
                        className="bg-[#1D2F6F] px-8 py-4 mx-6 sm:text-xl lg:text-2xl rounded-full text-white"
                    >
                        Get Started
                    </button>
                    <button
                        onClick={scrollToAbout}
                        className="bg-[#F88DAD] px-8 py-4 mx-6 sm:text-xl lg:text-2xl rounded-full text-white"
                    >
                        Learn More
                    </button>
                </div>
            </div>
            <div id="about-section">
                <AboutComponent />
            </div>
        </>
    );
}
