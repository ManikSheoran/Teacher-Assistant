import React from "react";

export default function StudentBox({ studentId }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md py-4 px-6 flex flex-col items-center justify-center w-full md:w-2/3 mx-auto space-y-4">
      <p className="text-black dark:text-white text-center">Student ID: {studentId}</p>
      <div className="flex flex-col space-y-2 w-full items-center">
        <a
          className="inline-block bg-primary dark:bg-blue-600 text-white py-2 px-4 rounded hover:bg-secondary dark:hover:bg-blue-700 w-full text-center"
          href={`/student/${studentId}/evaluate`}
        >
          Evaluate
        </a>
        <a
          className="inline-block bg-primary dark:bg-blue-600 text-white py-2 px-4 rounded hover:bg-secondary dark:hover:bg-blue-700 w-full text-center"
          href={`/student/${studentId}/feedbacks`}
        >
          Feedback History
        </a>
      </div>
    </div>
  );
}