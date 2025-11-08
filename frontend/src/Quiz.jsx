import React, { useState, useEffect } from "react";
import Question from "./Question";
import Result from "./Result";
import History from "./History";
import { API_BASE_URL } from "./config";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/questions/`)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        // setCurrentQuestionIndex(data.length - 1);
      });
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

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (quizEnded) {
    return <Result score={score} total={questions.length} />;
  }

  return (
    <div>
      <History
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        onQuestionSelect={handleQuestionSelect}
      />
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
