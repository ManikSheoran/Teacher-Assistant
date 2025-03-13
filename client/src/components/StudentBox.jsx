import React from "react";

export default function StudentBox({ studentId }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <p className="text-gray-500">Student ID: {studentId}</p>
      <a className="text-gray-500" href={`/student/${studentId}/evaluate`}>
        Evaluate
      </a>
    </div>
  );
}
