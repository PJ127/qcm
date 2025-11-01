import React from "react";
import "./Result.css";

function Result({ score, total }) {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="result-page">
      <div className="result-container">
        <h2>Quiz Terminé !</h2>
        <div className="score">
          {score} / {total}
        </div>
        <p>Vous avez obtenu {percentage}% de bonnes réponses</p>
      </div>
    </div>
  );
}

export default Result;
