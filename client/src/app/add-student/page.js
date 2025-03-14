"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

const StudentForm = () => {
    const [name, setName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const userId = getCookie("uid");
        const requestData = {
            userId,
            name,
            sid: studentId,
        };

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/addstudent`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                }
            );

            if (response.ok) {
                alert("Student added successfully");
                setName("");
                setStudentId("");
                router.push("/");
            } else {
                alert("Failed to add student");
            }
        } catch (error) {
            console.error("Error adding student:", error);
            alert("An error occurred while adding the student");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-0 min-h-screen">
            <div className="bg-[#F9E9EC] dark:bg-[#1D2F6F] shadow-md rounded-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <h1 className="text-2xl font-bold text-[#1D2F6F] dark:text-[#F9E9EC] mb-6 text-center">
                    Student Record
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter student name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 border-[#8390FA] dark:border-[#F88DAD] focus:ring-[#1D2F6F] dark:focus:ring-[#FAC748]"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="studentId"
                            name="studentId"
                            placeholder="Enter student ID"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            required
                            className="w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 border-[#8390FA] dark:border-[#F88DAD] focus:ring-[#1D2F6F] dark:focus:ring-[#FAC748]"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 bg-[#1D2F6F] text-white dark:text-[#1D2F6F] font-bold rounded-lg hover:bg-[#1c40cd] dark:hover:bg-[#fadf9d] dark:bg-[#FAC748] transition duration-300 ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;
