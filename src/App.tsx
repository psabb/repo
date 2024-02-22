import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Commercial from "./components/Commercial/Commercial";
import "./styles.css";
import LandingPage from "./components/Commercial/landingpage";
import { GraphData } from "./components/Commercial/GraphData";
import { withAuth } from "./msal/MsalAuthProvider";

const RootApp: React.FC = (props) => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage children={undefined} />} />
          <Route path="/commercial" element={<Commercial {...props} />} />
          <Route path="/graph-data" element={<GraphData />} />
        </Routes>
      </Router>
    </>
  );
};

export const App = withAuth(RootApp);
