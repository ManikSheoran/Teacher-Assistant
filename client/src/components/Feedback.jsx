import React from "react";

const Feedback = ({ feedback }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h1 className="text-2xl font-bold text-primary mb-4">{feedback.topic}</h1>
      <div
        className="text-black leading-relaxed"
        dangerouslySetInnerHTML={{ __html: feedback.feedback }}
      />
    </div>
  );
};

export default Feedback;
