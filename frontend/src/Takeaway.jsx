import React from "react";
import "./Takeaway.css";
import { SafeHTML } from "./utils/htmlUtils.jsx";

function Takeaway({ question }) {
  return (
    // <div id="takeaway">
    <SafeHTML html={question.takeaway} id="takeaway" />
    // </div>
  );
}

export default Takeaway;
