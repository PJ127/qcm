import React from "react";
import "./Question.css";
import Explanation from "./Explanation";
import Takeaway from "./Takeaway";

function Question({ question, onAnswer, questionNumber, totalQuestions }) {
  const [validated, setValidated] = React.useState(false);
  const [answerId, setAnswerId] = React.useState(null);
  const [isCorrect, setIsCorrect] = React.useState(null);
  const takeawayRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validated) {
      const selectedChoiceObj = question.choices.find((c) => c.id === answerId);
      setValidated(true);
      setIsCorrect(selectedChoiceObj.is_correct);
      setAnswerId(selectedChoiceObj.id);
    } else if (validated) {
      onAnswer(isCorrect);
      question.answer_id = answerId;
      question.validated = validated;
      question.is_correct = isCorrect;
    }
  };

  // Reset state if question changes
  React.useEffect(() => {
    setValidated(question.validated);
    setIsCorrect(question.is_correct);
    setAnswerId(question.answer_id);
    question.is_reached = true;
  }, [question]);

  // Scroll to takeaway when answer is validated
  React.useEffect(() => {
    if (validated && takeawayRef.current) {
      setTimeout(() => {
        takeawayRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  }, [validated]);

  const validatedClass = validated ? "validated" : "";

  return (
    <div className="page">
      <h1>{question.title}</h1>
      <div className="quiz-container">
        <div className="question-and-takeaway-container">
          <div className="question-container">
            <h2 className="question-number">
              Question {questionNumber} / {totalQuestions}
            </h2>
            <p className="question-text">{question.text}</p>
            <form className="choices-container" onSubmit={handleSubmit}>
              {question.choices.map((choice) => {
                let labelClass = "radiobutton";
                if (validated) {
                  if (choice.is_correct) {
                    labelClass += " correct";
                  } else if (answerId === choice.id) {
                    labelClass += " incorrect";
                  }
                }
                return (
                  <label key={choice.id} className={labelClass}>
                    <input
                      type="radio"
                      name="choice"
                      value={choice.id}
                      checked={answerId === choice.id}
                      onChange={() => setAnswerId(choice.id)}
                      className="choice-radio"
                      required={!validated}
                      disabled={validated}
                    />
                    {choice.text}
                  </label>
                );
              })}
              <div id="answer-and-submit-container">
                {validated && (
                  <span
                    id="correct-answer"
                    className={isCorrect ? "correct" : "incorrect"}
                  >
                    {isCorrect ? "Bonne réponse !" : "Mauvaise réponse !"}
                  </span>
                )}
                <button
                  type="submit"
                  id="choice-button"
                  className={validatedClass}
                  disabled={answerId === null && !validated}
                >
                  {validated ? "Suivant" : "Valider"}
                </button>
              </div>
            </form>
          </div>
          <div ref={takeawayRef}>
            {validated && <Takeaway question={question} />}
          </div>
        </div>
        <div className="separator"></div>
        <div className="image-container">
          <img
            src={
              validated ? question.image_explanation_url : question.image_url
            }
            alt="Question"
            className="question-image"
          />
          {validated && <Explanation question={question} />}
        </div>
      </div>
    </div>
  );
}

export default Question;
