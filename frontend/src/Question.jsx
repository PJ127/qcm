import React from "react";
import "./Question.css";

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

  const buttonClass = validated ? "choice-button validated" : "choice-button";

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
            <button
              type="submit"
              className={buttonClass}
              disabled={selectedChoice === null && !validated}
            >
              {validated ? "Suivant" : "Valider"}
            </button>
          </form>
        </div>
      </div>
      {validated && (
        <div className="explanation-container">
          <h3>Explication :</h3>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default Question;
