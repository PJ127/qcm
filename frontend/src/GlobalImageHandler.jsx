import React, { useEffect } from "react";

// Global image handler component
function GlobalImageHandler({ onImageClick }) {
  useEffect(() => {
    // Function to add click handlers to all images
    const addImageHandlers = () => {
      const allImages = document.querySelectorAll("img");

      allImages.forEach((img, index) => {
        // Skip images that already have click handlers
        if (img.dataset.hasClickHandler) {
          return;
        }

        // Add clickable styling
        img.style.cursor = "pointer";
        img.style.transition = "transform 0.2s ease";

        // Add hover effects
        const handleMouseEnter = () => {
          img.style.transform = "scale(1.02)";
        };
        const handleMouseLeave = () => {
          img.style.transform = "scale(1)";
        };

        // Add click handler
        const handleClick = () => {
          console.log("🖱️ Image clicked:", img.src, img.alt);
          onImageClick(img.src, img.alt || "Image");
        };

        // Add event listeners
        img.addEventListener("mouseenter", handleMouseEnter);
        img.addEventListener("mouseleave", handleMouseLeave);
        img.addEventListener("click", handleClick);

        // Store references for cleanup
        img._mouseEnterHandler = handleMouseEnter;
        img._mouseLeaveHandler = handleMouseLeave;
        img._clickHandler = handleClick;

        // Mark as processed
        img.dataset.hasClickHandler = "true";
      });
    };

    // Initial setup
    addImageHandlers();

    // Set up a MutationObserver to handle dynamically added images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the added node is an image
              if (node.tagName === "IMG") {
                addImageHandlers();
              }
              // Check for images within the added node
              const imagesInNode =
                node.querySelectorAll && node.querySelectorAll("img");
              if (imagesInNode && imagesInNode.length > 0) {
                addImageHandlers();
              }
            }
          });
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      observer.disconnect();

      // Remove all event listeners
      const allImages = document.querySelectorAll("img");
      allImages.forEach((img) => {
        if (img._mouseEnterHandler) {
          img.removeEventListener("mouseenter", img._mouseEnterHandler);
          img.removeEventListener("mouseleave", img._mouseLeaveHandler);
          img.removeEventListener("click", img._clickHandler);
          delete img._mouseEnterHandler;
          delete img._mouseLeaveHandler;
          delete img._clickHandler;
          delete img.dataset.hasClickHandler;
        }
      });
    };
  }, [onImageClick]);

  // Let's temporarily render something visible to see if the component is working
  return <div style={{ display: "none" }}>GlobalImageHandler is working!</div>;
}

export default GlobalImageHandler;
