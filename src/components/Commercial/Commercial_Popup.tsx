// Popup.tsx
import React from "react";
import successGif from "../../assets/correct.gif";
import errorGif from "../../assets/error.gif";
import warningGif from "../../assets/warning.gif";
import "./Commercial_Popup.css";

type PopupProps = {
  onClose: () => void;
  riskResults: any;
};

const Popup: React.FC<PopupProps> = ({ onClose, riskResults }) => {
  const renderGif = () => {
    const { percentage_ok } = riskResults;

    let gifSource = "";

    if (percentage_ok >= 80) {
      gifSource = successGif;
    } else if (percentage_ok < 60) {
      gifSource = errorGif;
    } else {
      gifSource = warningGif;
    }

    return <img src={gifSource} alt="Result GIF" className="custom-gif" />;
  };

  return (
    <div className="popup-container">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <br />
        {riskResults && (
          <div>
            <h2>
              <br />
              <p className="aboveline"> &#8212;</p>
              Risk Analysis Results
            </h2>

            {riskResults.percentage_ok !== undefined && (
              <h5>Score: {riskResults.percentage_ok.toFixed(2)}%</h5>
            )}
            <p>{riskResults.score_message}</p>
            <div className="gif-container">{renderGif()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
