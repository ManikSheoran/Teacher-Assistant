"use client";

import { useState, useEffect } from "react";

export default function UserFeedback() {
    const [loading, setLoading] = useState(true);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    useEffect(() => {
        // Minimum loader time
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleIframeLoad = () => {
        setIframeLoaded(true);
    };

    const showIframe = !loading && iframeLoaded;

    return (
        <div className="flex justify-center pt-20 w-full">
            <div className="w-full max-w-[1200px] relative">
                {/* Loader (shows until both loading and iframeLoaded are done) */}
                {(!showIframe) && (
                    <div className="flex flex-col items-center justify-center mt-10">
                        <div className="relative w-16 h-16">
                            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-r-transparent border-b-secondary border-l-transparent animate-spin"></div>
                            <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-t-transparent border-r-secondary border-b-transparent border-l-primary animate-spin animate-reverse"></div>
                        </div>
                        <p className="text-gray-400 mt-4">Loading feedback form...</p>
                    </div>
                )}

                {/* Iframe is shown only after loader and iframe load */}
                <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLScXGa0QDA88rzrqMsyLUrKq6MXadkLZ6XcOSC8myz_nad_iag/viewform?embedded=true"
                    width="100%"
                    height="2960px"
                    className={showIframe ? "block" : "hidden"}
                    style={{
                        border: "none",
                        margin: 0,
                    }}
                    onLoad={handleIframeLoad}
                    title="User Feedback Form"
                />
            </div>
        </div>
    );
}
