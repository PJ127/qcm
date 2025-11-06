import React, { useState } from "react";
import "./History.css";
import ContactModal from "./ContactModal";

function History({ questions, currentQuestionIndex, onQuestionSelect }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState("contact"); // "contact" or "contribuer"

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const handleQuestionClick = (index) => {
    onQuestionSelect(index);
  };

  const handleContactClick = () => {
    setContactType("contact");
    setShowContactModal(true);
  };

  const handleContribuerClick = () => {
    setContactType("contribuer");
    setShowContactModal(true);
  };

  const closeModal = () => {
    setShowContactModal(false);
  };

  return (
    <>
      <div className={`sidebar ${isVisible ? "visible" : "hidden"}`}>
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          title={isVisible ? "Cacher l'historique" : "Afficher l'historique"}
        >
          {isVisible ? "◀" : "▶"}
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
                disabled={
                  !question.is_reached &&
                  index !== currentQuestionIndex &&
                  false
                }
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
          <div className="sidebar-footer">
            <button
              className="footer-button contact-button"
              onClick={handleContactClick}
            >
              Contact
            </button>
            <button
              className="footer-button contribuer-button"
              onClick={handleContribuerClick}
            >
              Contribuer au questionnaire
            </button>
          </div>
        </div>
      </div>
      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={closeModal}
          type={contactType}
        />
      )}
    </>
  );
}

export default History;
