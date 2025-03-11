import { getCookie } from "cookies-next";
export default function HeroComponent() {
    const uid = getCookie("uid");
    return (
        <div className="flex flex-col items-center p-6 bg-white text-black min-h-screen w-full">
            <h1 className="text-4xl font-semibold text-center mb-6 mt-20">
                Welcome, Teacher!
            </h1>
            <div className="flex flex-col items-center space-y-4">
                <a
                    href="/add-student"
                    className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
                >
                    Add Student
                </a>
                <a
                    href={`${uid}/studentlist`}
                    className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
                >
                    View Students List
                </a>
                <a
                    href="/evaluate"
                    className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
                >
                    {" "}
                    Evaluate
                </a>
            </div>
        </div>
    );
}
