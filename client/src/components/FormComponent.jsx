// FormComponent.jsx
"use client";
import React, { useState } from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const FormComponent = () => {
  const [useImageUpload, setUseImageUpload] = useState(false);
  const [topic, setTopic] = useState("");
  const [marks, setMarks] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleToggle = () => {
    setUseImageUpload((prev) => !prev);
    setQuestion("");
    setAnswer("");
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (useImageUpload && imageFile) {
      const formData = new FormData();
      formData.append("topic", topic);
      formData.append("marks", marks);
      formData.append("image", imageFile);

      try {
        const response = await fetch("http://localhost:8000/api/v1/ocr", {
          method: "POST",
          body: formData,
        });
        const result = await response.text();
        setFeedback(result);
      } catch (error) {
        console.error("Error in OCR upload:", error);
        setFeedback("Error processing image");
      }
    } else {
      try {
        const response = await fetch("http://localhost:8000/api/v1/evaluate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            marks,
            question,
            answer,
          }),
        });
        const result = await response.text();
        setFeedback(result);
      } catch (error) {
        console.error("Error in text evaluation:", error);
        setFeedback("Error evaluating answer");
      }
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col items-center p-6 bg-white text-black min-h-screen w-full">
      <h1 className="text-4xl font-semibold text-left w-full max-w-3xl">
        AI Evaluation
      </h1>
      <hr className="border-t-2 border-gray-600 opacity-30 w-full max-w-3xl my-4" />
      <form
        onSubmit={async (e) => {
          setLoading(true);
          await handleSubmit(e);
          setLoading(false);
        }}
        className="w-full max-w-3xl bg-transparent border-2 border-gray-300 p-6 rounded-lg"
      >
        <FormControlLabel
          control={
            <Switch
              checked={useImageUpload}
              onChange={handleToggle}
              sx={{
                "& .MuiSwitch-switchBase": {
                  color: "#999",
                  "&.Mui-checked": {
                    color: "#0d9488",
                  },
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "#ccc",
                },
                "& .Mui-checked+.MuiSwitch-track": {
                  backgroundColor: "#0d9488 !important",
                },
              }}
            />
          }
          label="Upload Image Instead?"
          className="mb-4"
        />

        {!useImageUpload && (
          <>
            <div className="flex flex-wrap gap-6 mb-4">
              <div className="flex-1 flex flex-col">
                <label htmlFor="topic" className="font-bold mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  className="border border-gray-300 rounded p-2"
                  placeholder="Enter topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label htmlFor="marks" className="font-bold mb-2">
                  Max. Marks
                </label>
                <input
                  type="number"
                  id="marks"
                  className="border border-gray-300 rounded p-2"
                  placeholder="Enter max marks"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="question" className="font-bold mb-2 block">
                Question
              </label>
              <textarea
                id="question"
                rows="2"
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Enter the question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="answer" className="font-bold mb-2 block">
                Answer
              </label>
              <textarea
                id="answer"
                rows="3"
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Enter the answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </>
        )}

        {useImageUpload && (
          <>
            <div className="flex flex-wrap gap-6 mb-4">
              <div className="flex-1 flex flex-col">
                <label htmlFor="topic" className="font-bold mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  className="border border-gray-300 rounded p-2"
                  placeholder="Enter topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label htmlFor="marks" className="font-bold mb-2">
                  Max. Marks
                </label>
                <input
                  type="number"
                  id="marks"
                  className="border border-gray-300 rounded p-2"
                  placeholder="Enter max marks"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="imageFile" className="font-bold mb-2 block">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                id="imageFile"
                name="image"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
          </>
        )}
        <div className="flex items-center">
          <button
            type="submit"
            className="flex items-center ml-auto mt-4 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
          >
            Evaluate
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 2,
                }}
              >
                <CircularProgress
                  size={20}
                  className="text-teal-200"
                  thickness={6}
                  color="#99f6e4"
                />
              </Box>
            )}
          </button>
        </div>
      </form>
      {feedback && (
        <div
          className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded"
          dangerouslySetInnerHTML={{ __html: feedback }}
        />
      )}
    </div>
  );
};

export default FormComponent;
