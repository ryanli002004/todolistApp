import React, { useState } from "react";
import AuthPopup from "./components/auth/AuthPopup";

const App = () => {
  const [showPopup, setShowPopup] = useState(true); // Display popup initially

  return (
    <div>
      {showPopup && <AuthPopup onClose={() => setShowPopup(false)} />}
      <h1>Welcome to the To-Do List App</h1>
      {/* Rest of your app content */}
    </div>
  );
};

export default App;