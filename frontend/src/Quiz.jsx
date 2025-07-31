import React, { useState, useEffect } from "react";
import Question from "./Question";
import Result from "./Result";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/questions/")
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setQuizEnded(true);
    }
  };

  if (quizEnded) {
    return <Result score={score} total={questions.length} />;
  }

  return (
    <div>
      {questions.length > 0 && (
        <Question
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      )}
    </div>
  );
}

export default Quiz;
