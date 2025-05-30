import React, { useEffect, useState } from "react";
import "./WelcomePage.css"; // Create this CSS file for styles

const WelcomePage = ({ onFinish }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Show "Resto" after 1.5s
    const textTimer = setTimeout(() => setShowText(true), 1500);
    // Move to next page after 3s
    const finishTimer = setTimeout(() => onFinish(), 3000);
    return () => {
      clearTimeout(textTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="welcome-bg">
      <div className="circles">
        <div className="circle c1"></div>
        <div className="circle c2"></div>
        <div className="circle c3"></div>
      </div>
      <div className={`resto-text ${showText ? "show" : ""}`}>Resto</div>
    </div>
  );
};

export default WelcomePage;