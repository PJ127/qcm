import { useState } from "react";
import "./App.css";
import Quiz from "./Quiz";

function App() {
  // const [questions, setQuestions] = useState([]);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [score, setScore] = useState(0);
  // const [quizCompleted, setQuizCompleted] = useState(false);

  // useEffect(() => {
  //   // Fetch questions from your backend
  //   fetch("http://localhost:8000/questions")
  //     .then((response) => response.json())
  //     .then((data) => setQuestions(data))
  //     .catch((error) => console.error("Error fetching questions:", error));
  // }, []);

  // const handleAnswer = (isCorrect) => {
  //   if (isCorrect) {
  //     setScore(score + 1);
  //   }

  //   if (currentQuestionIndex + 1 < questions.length) {
  //     setCurrentQuestionIndex(currentQuestionIndex + 1);
  //   } else {
  //     setQuizCompleted(true);
  //   }
  // };

  // if (questions.length === 0) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <div className="App">
        <Quiz />
      </div>
    </>
  );
}

export default App;
