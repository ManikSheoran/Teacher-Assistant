import React from "react";

const Feedback = ({ feedback }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <p className="text-gray-500">Feedback: {feedback}</p>
    </div>
  );
};

export default Feedback;
