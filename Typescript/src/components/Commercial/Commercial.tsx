// NavbarContainer.tsx
import React, { useState } from "react";
import "./Commercial_NavbarContainer.css";
import GlassMorphContainer from "./Commercial_GlassMorphContainer";
import MySideNav from "./MySideNav";
import localGif from "../../assets/abb.png";

const NavbarContainer = () => {
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

  return (
    <>
      <div className="navbar-container">
        <MySideNav />

        <div className="logo-container">
          <img src={localGif} alt="Local GIF" className="logo-image" />
        </div>
      </div>
      <GlassMorphContainer
        children={undefined}
        isSideMenuOpen={isSideMenuOpen}
        setMenuOpen={setSideMenuOpen}
      />
    </>
  );
};

export default NavbarContainer;
