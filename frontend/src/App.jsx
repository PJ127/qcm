import { useState } from "react";
import "./App.css";
import Quiz from "./Quiz";
import GlobalImageHandler from "./GlobalImageHandler";
import ImageModal from "./ImageModal";

function App() {
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageAlt, setModalImageAlt] = useState("");

  const handleImageClick = (imageSrc, imageAlt) => {
    setModalImageSrc(imageSrc);
    setModalImageAlt(imageAlt);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  return (
    <>
      <div className="App">
        <Quiz />
        <GlobalImageHandler onImageClick={handleImageClick} />
        {showImageModal && (
          <ImageModal
            imageSrc={modalImageSrc}
            imageAlt={modalImageAlt}
            onClose={closeImageModal}
          />
        )}
      </div>
    </>
  );
}

export default App;
