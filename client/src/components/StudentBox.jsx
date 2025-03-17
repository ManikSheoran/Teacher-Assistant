import React from "react";

export default function StudentBox({ studentId }) {
  return (
    <div className="bg-white rounded-lg shadow-md py-4 px-6 md:flex items-center justify-between md:w-2/3 mx-auto">
      <p className="text-black">Student ID: {studentId}</p>
      <div>
        <a
          className="inline-block bg-primary text-white py-2 px-4 rounded hover:bg-secondary mr-2"
          href={`/student/${studentId}/evaluate`}
        >
          Evaluate
        </a>
        <a
          className="inline-block bg-primary text-white py-2 px-4 rounded hover:bg-secondary"
          href={`/student/${studentId}/feedbacks`}
        >
          Feedback History
        </a>
      </div>
    </div>
  );
}
