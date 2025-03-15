import React from "react";

export default function StudentBox({ studentId }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <p className="text-gray-500 mb-4">Student ID: {studentId}</p>
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
  );
}
