export default function IntroComponent(){
    return (
        <>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center p-6 text-black min-h-screen w-full justify-center">
                    <h1 className="lg:text-7xl sm:text-4xl text-center font-bold lg:mx-10">
                        Effortless Grading, Deeper Insights, Better Learning
                    </h1>
                    <p className="text-center mt-10 sm:text-xl lg:text-2xl lg:mx-10">
                        Say goodbye to hours of manual grading. NeuroGrade's
                        AI-powered assistant streamlines assessment, giving you
                        faster results and deeper student insights.
                    </p>
                </div>
                <div>
                    <button>Get Started</button>
                </div>
            </div>
        </>
    );
}