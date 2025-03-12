import { useUser } from "@/context/UserContext";
import { getCookie } from "cookies-next";

export default function HeroComponent() {
    const { user } = useUser();
    const uid = getCookie("uid");

    return (
        <div className="flex flex-col items-center p-4 sm:p-6 bg-transparent text-black min-h-screen w-full">
            <h1 className="text-3xl sm:text-4xl text-blue-400 font-semibold text-center mb-6 mt-16 sm:mt-20">
                {`Welcome, ${user.name ? user.name : "Teacher"}!`}
            </h1>
            <div className="flex flex-col items-center space-y-4 w-full max-w-xs sm:max-w-sm">
                <a
                    href="/add-student"
                    className="w-full text-center bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-300"
                >
                    Add Student
                </a>
                <a
                    href={`${uid}/studentlist`}
                    className="w-full text-center bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-300"
                >
                    View Students List
                </a>
                <a
                    href="/evaluate"
                    className="w-full text-center bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-300"
                >
                    Evaluate
                </a>
            </div>
        </div>
    );
}
