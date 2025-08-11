import React, { useState } from "react";
import "./History.css";

function History({ questions, currentQuestionIndex, onQuestionSelect }) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const handleQuestionClick = (index) => {
    onQuestionSelect(index);
  };

  return (
    <div className={`sidebar ${isVisible ? "visible" : "hidden"}`}>
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        title={isVisible ? "Cacher l'historique" : "Afficher l'historique"}
      >
        {isVisible ? "▶" : "◀"}
      </button>

      <div className="sidebar-content">
        <h3>Historique</h3>
        <div className="question-indicators">
          {questions.map((question, index) => (
            <button
              key={index}
              className={`question-indicator ${
                index === currentQuestionIndex ? "current" : ""
              } ${
                question.answer_id
                  ? question.is_correct
                    ? "correct"
                    : "incorrect"
                  : "not_answered"
              }`}
              onClick={() => handleQuestionClick(index)}
              disabled={!question.is_reached && index !== currentQuestionIndex}
              title={
                question.is_reached
                  ? `Retourner à la question ${index + 1}`
                  : "Question non encore atteinte"
              }
            >
              {question.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;
