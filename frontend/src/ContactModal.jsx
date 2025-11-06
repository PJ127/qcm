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
  const [attachments, setAttachments] = useState([]);

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        setAttachments((prev) => [
          ...prev,
          { filename: file.name, data: base64Data },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
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

    try {
      // Send email via API
      const response = await fetch("http://localhost:8000/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          nom: formData.nom,
          prenom: formData.prenom,
          raison: formData.raison,
          message: formData.message,
          contact_type: type,
          attachments: attachments.length > 0 ? attachments : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setSubmitMessage(
        "Votre message a été envoyé avec succès ! Vous allez recevoir une copie par email."
      );

      // Reset form after a delay
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitMessage(
        "Une erreur est survenue. Veuillez réessayer plus tard ou écrire directement à contact@pourquoi-vacciner.fr"
      );
    } finally {
      setIsSubmitting(false);
    }
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
    setAttachments([]);
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
              <option value="courbes">Donner des courbes officielles</option>
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

          <div className="form-group">
            <label htmlFor="attachments">
              Pièces jointes{" "}
              <span style={{ fontSize: "0.9em", color: "#666" }}>
                (optionnel)
              </span>
            </label>
            <input
              type="file"
              id="attachments"
              onChange={handleFileChange}
              multiple
              className="file-input"
            />
            {attachments.length > 0 && (
              <div className="attachments-list">
                {attachments.map((att, index) => (
                  <div key={index} className="attachment-item">
                    <span className="attachment-name">📎 {att.filename}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="remove-attachment"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
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
