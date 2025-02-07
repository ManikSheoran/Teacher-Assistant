// FormComponent.jsx
import React from 'react';
import './styles.css';

const FormComponent = () => {
  return (
    <div className="container">
      <h1>AI Evaluation</h1>
      <hr className="divider" />
      <div className="form-box">
        <div className="input-row">
          <div className="input-col">
            <div className="input-field topic-box">
              <label htmlFor="topic">Topic</label>
              <input type="text" id="topic" placeholder="Enter topic"/>
            </div>
          </div>
          <div className="input-col">
            <div className="input-field max-marks">
              <label htmlFor="marks">Max. Marks</label>
              <input type="number" id="marks" placeholder="Enter max marks" />
            </div>
          </div>
        </div>

        <div className="input-field">
          <label htmlFor="question">Question</label>
          <textarea id="question" rows="1" placeholder="Enter question"></textarea>
        </div>

        <div className="input-field">
          <label htmlFor="answer">Answer</label>
          <textarea id="answer" rows="3" placeholder="Enter the answer"></textarea>
        </div>

        <button type="submit">Evaluate</button>
      </div>
    </div>
  );
};

export default FormComponent;