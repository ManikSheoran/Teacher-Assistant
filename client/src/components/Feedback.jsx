import React from "react";

const Feedback = ({ feedback }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-4">{feedback.topic}</h1>
      <div
        className="text-gray-700 dark:text-gray-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: feedback.feedback }}
      />
    </div>
  );
};

export default Feedback;
