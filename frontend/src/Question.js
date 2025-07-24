import React from "react";
import "./Question.css";
function Question({ question, onAnswer }) {
  return (
    <div>
      <h1>{question.title}</h1>
      <div className="quiz-container">
        <div className="image-container">
          <img
            src={question.image_url}
            alt="Question"
            className="question-image"
          />
        </div>
        <div className="choices-container">
          <h2 className="question-text">{question.text}</h2>
          <div className="choices-container2">
            {question.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => onAnswer(choice.is_correct)}
                className="choice-button"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p>{question.explanation}</p>
    </div>
  );
}

export default Question;
