import React from "react";

// Simple HTML sanitizer function
export const sanitizeHTML = (html) => {
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
export const SafeHTML = ({ html, className, id }) => {
  const sanitizedHTML = React.useMemo(() => sanitizeHTML(html), [html]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      className={className}
      id={id}
    />
  );
};
