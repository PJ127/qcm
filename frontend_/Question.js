import React from "react";

function Question({ question, onAnswer }) {
  return (
    <div>
      <img src={question.image_url} alt="Question" />
      <h2>{question.text}</h2>
      <div>
        {question.choices.map((choice) => (
          <button key={choice.id} onClick={() => onAnswer(choice.is_correct)}>
            {choice.text}
          </button>
        ))}
      </div>
      <p>{question.explanation}</p>
    </div>
  );
}

export default Question;
