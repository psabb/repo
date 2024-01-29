import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Commercial from "./components/Commercial/Commercial";
import "./styles.css";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Commercial />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
