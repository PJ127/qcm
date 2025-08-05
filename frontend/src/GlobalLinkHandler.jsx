import React, { useEffect } from "react";

function GlobalLinkHandler() {
  useEffect(() => {
    // Function to add target="_blank" to all links
    const addLinkHandlers = () => {
      const allLinks = document.querySelectorAll("a");

      allLinks.forEach((link, index) => {
        if (link.target === "_blank") {
          return;
        }

        // Add target="_blank" to external links
        if (link.href && !link.href.startsWith(window.location.origin)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer"; // Security best practice
        }
        // For internal links, you can choose to add target="_blank" as well
        // Uncomment the next lines if you want ALL links to open in new tabs
        /*
        else if (link.href) {
          link.target = "_blank";
          console.log("✅ Added target=_blank to internal link:", link.href);
        }
        */
      });
    };

    // Initial setup
    addLinkHandlers();

    // Set up a MutationObserver to handle dynamically added links
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the added node is a link
              if (node.tagName === "A") {
                addLinkHandlers();
              }
              // Check for links within the added node
              const linksInNode =
                node.querySelectorAll && node.querySelectorAll("a");
              if (linksInNode && linksInNode.length > 0) {
                addLinkHandlers();
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
    };
  }, []);

  // This component doesn't render anything
  return null;
}

export default GlobalLinkHandler;
