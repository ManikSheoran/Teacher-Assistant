import React from "react";

export default function StudentBox({ studentId }) {
  return (
    <div className="bg-sky-100 dark:bg-gray-800 rounded-lg shadow-md py-4 px-6 flex flex-col items-center justify-center w-full md:w-2/3 mx-auto space-y-4">
      <p className="text-black dark:text-white text-center">Student ID: {studentId}</p>
      <div className="flex flex-col space-y-2 w-full items-center">
        <a
          className="inline-block bg-[#1d2f6f] dark:bg-[#1d2f6f] text-white py-2 px-4 rounded hover:bg-[#8390FA] dark:hover:bg-[#8390FA] w-full text-center"
          href={`/student/${studentId}/evaluate`}
        >
          Evaluate
        </a>
        <a
          className="inline-block bg-[#1d2f6f] dark:bg-[#1d2f6f] text-white py-2 px-4 rounded hover:bg-[#8390FA] dark:hover:bg-[#8390FA] w-full text-center"
          href={`/student/${studentId}/feedbacks`}
        >
          Feedback History
        </a>
      </div>
    </div>
  );
}