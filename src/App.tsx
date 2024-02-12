import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Commercial from "./components/Commercial/Commercial";
import "./styles.css";
import { GraphData } from "./components/Commercial/GraphData";
import { withAuth } from "./msal/MsalAuthProvider";

// Use ":" instead of "=" for type annotation
const RootApp: React.FC = (props) => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Commercial {...props} />} />
          <Route path="/graph-data" element={<GraphData />} />
        </Routes>
      </Router>
    </>
  );
};

export const App = withAuth(RootApp); // Corrected: Pass RootApp instead of App
