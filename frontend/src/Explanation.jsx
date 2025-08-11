import React from "react";
import "./Explanation.css";

// Simple HTML sanitizer function
const sanitizeHTML = (html) => {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Remove potentially dangerous tags and attributes
  const dangerousTags = [
    "script",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
    "button",
    "select",
    "textarea",
  ];
  const dangerousAttributes = [
    "onclick",
    "onload",
    "onerror",
    "onmouseover",
    "onfocus",
    "javascript:",
  ];

  // Remove dangerous tags
  dangerousTags.forEach((tag) => {
    const elements = tempDiv.getElementsByTagName(tag);
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  });

  // Remove dangerous attributes from all elements
  const allElements = tempDiv.getElementsByTagName("*");
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    const attributes = element.attributes;
    for (let j = attributes.length - 1; j >= 0; j--) {
      const attr = attributes[j];
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value.toLowerCase();

      // Remove dangerous attributes
      if (
        dangerousAttributes.some(
          (dangerous) =>
            attrName.includes(dangerous) || attrValue.includes(dangerous)
        )
      ) {
        element.removeAttribute(attr.name);
      }
    }
  }

  return tempDiv.innerHTML;
};

// Safe HTML component
const SafeHTML = ({ html }) => {
  const sanitizedHTML = React.useMemo(() => sanitizeHTML(html), [html]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      className="explanation-html"
    />
  );
};

function Explanation({ question }) {
  return (
    <div className="e">
      <div className="explanation-container">
        <h3>Explication :</h3>
        <SafeHTML html={question.explanation} />
        <div id="sources">
          <p id="sources_title">Sources:</p>
          <ul id="sources_list"></ul>
        </div>
      </div>
    </div>
  );
}

export default Explanation;
