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

        <img
          src={localGif}
          alt="Local GIF"
          style={{
            width: "5%",
            height: "40%",
            marginLeft: "6%",
            marginTop: "1.4%",
          }}
        />

        <p className="container-text">Intelli Reader</p>
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
