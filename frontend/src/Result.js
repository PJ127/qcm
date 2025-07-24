import React from "react";

function Result({ score, total }) {
  return (
    <div>
      <h2>Quiz Completed!</h2>
      <p>
        Your score: {score} out of {total}
      </p>
    </div>
  );
}

export default Result;
