// FormComponent.jsx
"use client"
import React, { useState } from "react";
import "./styles.css";

const FormComponent = () => {
    const [topic, setTopic] = useState("");
    const [marks, setMarks] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            topic,
            question,
            answer,
            marks,
        };

        try {
            const response = await fetch("http://localhost:8000/evaluate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log(result);
            // Handle the response as needed
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container">
            <h1>AI Evaluation</h1>
            <hr className="divider" />
            <form onSubmit={handleSubmit}>
                <div className="form-box">
                    <div className="input-row">
                        <div className="input-col">
                            <div className="input-field topic-box">
                                <label htmlFor="topic">Topic</label>
                                <input
                                    type="text"
                                    id="topic"
                                    placeholder="Enter topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input-col">
                            <div className="input-field max-marks">
                                <label htmlFor="marks">Max. Marks</label>
                                <input
                                    type="number"
                                    id="marks"
                                    placeholder="Enter max marks"
                                    value={marks}
                                    onChange={(e) => setMarks(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="input-field">
                        <label htmlFor="question">Question</label>
                        <textarea
                            id="question"
                            rows="1"
                            placeholder="Enter question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="input-field">
                        <label htmlFor="answer">Answer</label>
                        <textarea
                            id="answer"
                            rows="3"
                            placeholder="Enter the answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit">Evaluate</button>
                </div>
            </form>
        </div>
    );
};

export default FormComponent;
