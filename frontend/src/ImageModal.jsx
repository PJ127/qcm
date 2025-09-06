import React from "react";
import "./ImageModal.css";

function ImageModal({ imageSrc, imageAlt, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = imageAlt || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle escape key press
  React.useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listener when modal is open
    document.addEventListener("keydown", handleEscapeKey);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div className="image-modal-backdrop" onClick={handleBackdropClick}>
      <div className="image-modal-content">
        <div className="image-modal-header">
          <button
            className="image-modal-button download-button"
            onClick={handleDownload}
          >
            📥 Télécharger
          </button>
          <button className="image-modal-button close-button" onClick={onClose}>
            ✕ Fermer
          </button>
        </div>
        <div className="image-modal-body">
          <img src={imageSrc} alt={imageAlt} className="image-modal-image" />
        </div>
      </div>
    </div>
  );
}

export default ImageModal;
