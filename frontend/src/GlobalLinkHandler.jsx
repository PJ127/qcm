import React, { useEffect } from "react";

function GlobalLinkHandler() {
  useEffect(() => {
    // Function to add target="_blank" to all links
    const addLinkHandlers = () => {
      const allLinks = document.querySelectorAll("a");
      let iLink = 0;
      let sources_html = "";
      allLinks.forEach((link, index) => {
        if (link.target === "_blank") {
          return;
        }

        if (link.href && !link.href.startsWith(window.location.origin)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer"; // Security best practice
          iLink += 1;
          sources_html +=
            "<li>[" +
            iLink +
            "] " +
            link.innerText +
            " : " +
            "<a target='_blank' href=" +
            link.href +
            ">" +
            link.href +
            "</a>" +
            "</li>";
          link.innerHTML = "<sup>[" + iLink + "]</sup>";
        }
      });
      let sources_element = document.getElementById("sources");
      if (sources_element === null) {
        return;
      }
      if (iLink > 0) {
        sources_element.hidden = false;
        let sources_list = document.getElementById("sources_list");
        sources_list.innerHTML = sources_html;
      }
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
