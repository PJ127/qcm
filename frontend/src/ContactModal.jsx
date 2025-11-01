import React, { useState } from "react";
import "./ContactModal.css";

function ContactModal({ isOpen, onClose, type }) {
  const [formData, setFormData] = useState({
    email: "",
    nom: "",
    prenom: "",
    raison: "autre",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Le courriel est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Veuillez entrer un courriel valide";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Construct mailto link
    const subject =
      type === "contribuer"
        ? "Contribution - Pourquoi Vacciner"
        : "Contact - Pourquoi Vacciner";
    const body = `Nom: ${formData.nom || "Non renseigné"}
Prénom: ${formData.prenom || "Non renseigné"}
Raison: ${formData.raison}
Courriel: ${formData.email}

Message:
${formData.message}`;

    const mailtoLink = `mailto:contact@pourquoi-vacciner.fr?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Open email client
    window.location.href = mailtoLink;

    setSubmitMessage(
      "Votre client de messagerie va s'ouvrir. Merci pour votre message !"
    );
    setIsSubmitting(false);

    // Reset form after a delay
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setFormData({
      email: "",
      nom: "",
      prenom: "",
      raison: "autre",
      message: "",
    });
    setErrors({});
    setSubmitMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>{type === "contribuer" ? "Contribuer" : "Contact"}</h2>
          <p className="modal-subtitle">
            {type === "contribuer"
              ? "Aidez-nous à améliorer ce quiz en proposant des questions ou des corrections"
              : "Contactez-nous pour toute question ou suggestion"}
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              Courriel <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="votre@courriel.fr"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Votre nom (facultatif)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="prenom">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Votre prénom (facultatif)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="raison">
              Raison <span className="required">*</span>
            </label>
            <select
              id="raison"
              name="raison"
              value={formData.raison}
              onChange={handleChange}
            >
              <option value="correction">Apporter une correction</option>
              <option value="question">Proposer une question</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">
              Message <span className="required">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? "error" : ""}
              rows="6"
              placeholder="Votre message..."
            />
            {errors.message && (
              <span className="error-message">{errors.message}</span>
            )}
          </div>

          <div className="form-footer">
            <p className="info-text">
              💡 Vous pouvez aussi écrire directement à{" "}
              <a href="mailto:contact@pourquoi-vacciner.fr">
                contact@pourquoi-vacciner.fr
              </a>
            </p>
            {submitMessage && (
              <p className="success-message">{submitMessage}</p>
            )}
            <div className="form-buttons">
              <button
                type="button"
                onClick={handleClose}
                className="btn-cancel"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
