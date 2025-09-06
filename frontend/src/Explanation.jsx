import React from "react";
import "./Explanation.css";
import { SafeHTML } from "./utils/htmlUtils.jsx";

function Explanation({ question }) {
  return (
    <div className="e">
      <div className="explanation-container">
        <h3>Explication :</h3>
        <SafeHTML html={question.explanation} className="explanation-html" />
        <div id="sources">
          <p id="sources_title">Sources:</p>
          <ul id="sources_list"></ul>
        </div>
      </div>
    </div>
  );
}

export default Explanation;
