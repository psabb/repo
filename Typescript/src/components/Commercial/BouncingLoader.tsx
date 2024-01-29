import React from "react";
import "./BouncingLoader.css";

// Define the type of props
interface BouncingDotsLoaderProps {
  // Define any props you expect to receive
}

// Use the defined type for props
const BouncingDotsLoader: React.FC<BouncingDotsLoaderProps> = (props) => {
  return (
    <>
      <div className="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default BouncingDotsLoader;
