// Example usage in App.jsx
import React, { useState } from "react";
import WelcomePage from "./components/Component1";
import LoginSignupPage from "./pages/LoginSignupPage"; // Create this page

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return showWelcome ? (
    <WelcomePage onFinish={() => setShowWelcome(false)} />
  ) : (
    <LoginSignupPage />
  );
}

export default App;