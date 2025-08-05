import React from "react";
import "./Question.css";
import Explanation from "./Explanation";

function Question({ question, onAnswer, questionNumber, totalQuestions }) {
  const [selectedChoice, setSelectedChoice] = React.useState(null);
  const [validated, setValidated] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validated && selectedChoice !== null) {
      setValidated(true);
    } else if (validated) {
      // On 'Suivant', call onAnswer with the selected answer's correctness
      const choice = question.choices.find((c) => c.id === selectedChoice);
      onAnswer(choice.is_correct);
      setSelectedChoice(null);
      setValidated(false);
    }
  };

  // Reset state if question changes
  React.useEffect(() => {
    setSelectedChoice(null);
    setValidated(false);
  }, [question]);

  const validatedClass = validated ? "validated" : "";

  // Determine the answer class based on the selected choice
  const getAnswerClass = () => {
    if (!validated || selectedChoice === null) return "";
    const selectedChoiceObj = question.choices.find(
      (c) => c.id === selectedChoice
    );
    return selectedChoiceObj && selectedChoiceObj.is_correct
      ? "correct"
      : "incorrect";
  };

  return (
    <div className="page">
      <h1>{question.title}</h1>
      <div className="quiz-container">
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
                } else if (selectedChoice === choice.id) {
                  labelClass += " incorrect";
                }
              }
              return (
                <label key={choice.id} className={labelClass}>
                  <input
                    type="radio"
                    name="choice"
                    value={choice.id}
                    checked={selectedChoice === choice.id}
                    onChange={() => setSelectedChoice(choice.id)}
                    className="choice-radio"
                    disabled={validated}
                  />
                  {choice.text}
                </label>
              );
            })}
            <div id="answer-and-submit-container">
              {validated && (
                <span id="correct-answer" className={getAnswerClass()}>
                  {getAnswerClass() === "correct"
                    ? "Bonne réponse !"
                    : "Mauvaise réponse !"}
                </span>
              )}
              <button
                type="submit"
                id="choice-button"
                className={validatedClass}
                disabled={selectedChoice === null && !validated}
              >
                {validated ? "Suivant" : "Valider"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Question;
