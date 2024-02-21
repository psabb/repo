import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Commercial from "./components/Commercial/Commercial";
import "./styles.css";
import LandingPage from "./components/Commercial/landingpage";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Commercial />} /> */}
          <Route path="/" element={<LandingPage children={undefined} />} />

          {/* Commercial will be rendered for an empty path */}
          <Route path="/commercial" element={<Commercial />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
