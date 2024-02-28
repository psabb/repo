// NavbarContainer.tsx
import React, { useState } from "react";
import "./Commercial_NavbarContainer.css";
import GlassMorphContainer from "./Commercial_GlassMorphContainer";
import MySideNav from "./MySideNav";
import localGif from "../../assets/abb.png";
import { Link } from "react-router-dom";
import { UserLogin } from "./UserLogin";

interface NavbarContainerProps {}

const NavbarContainer: React.FC<NavbarContainerProps> = (props) => {
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const [storedVectorStoreName, setStoredVectorStoreName] = useState<
    string | null
  >(null);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);

  return (
    <>
      <div className="navbar-container">
        <MySideNav
          storedVectorStoreName={storedVectorStoreName}
          fileUploaded={fileUploaded}
        />
        <Link to="/">
          <div className="logo-container">
            <img src={localGif} alt="Local GIF" className="logo-image" />
          </div>
        </Link>
        <div className="user-login-container">
          <UserLogin {...props} />
        </div>
      </div>
      <GlassMorphContainer
        children={undefined}
        isSideMenuOpen={isSideMenuOpen}
        setMenuOpen={setSideMenuOpen}
        setstoredVectorStoreName={setStoredVectorStoreName}
        setFileUploaded={setFileUploaded}
      />
    </>
  );
};

export default NavbarContainer;
