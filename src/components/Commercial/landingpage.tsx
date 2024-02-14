import React from "react";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./landingpage.css";
import logo from "../../assets/abb.png";
import { Link } from "react-router-dom";

interface LandingPageProps {
  children: React.ReactNode;
}

const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <>
      <div className="glass-morph-wrapper1">
        <div className="glass-morph-container1 d-flex flex-column align-items-center justify-content-center">
          {/* Logo */}
          <img src={logo} alt="Logo" className="logo-img" />

          <div className="greeting2">
            <p>Hi, I am PAEN ABBot</p>
            <div className="greeting3">
              <p>How Can I Help You Today?</p>
            </div>
          </div>

          {/* Cards */}
          <div className="row justify-content-center">
            <div className="col-md-6 mb-3">
              {/* First Card */}
              <Card style={{ width: "60%", marginLeft: "40%" }}>
                <Link to="https://library.abb.com/" className="card-link">
                  <Card.Img
                    variant="top"
                    src="https://media-d.global.abb/is/image/abbc/Electrifying%20the%20world%20-%20Solar%20Inverter:16x9?wid=1440&hei=810"
                    alt="First Card image"
                  />
                  <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Title className="text-center">
                      ABB Library Center
                    </Card.Title>

                    <Card.Subtitle className="mb-2 text-muted text-center">
                      A online dediacted portal for search ABB related
                      Documents, which will be easily available for downloads
                      either in MP4 or PDF formats .
                    </Card.Subtitle>

                    <Button variant="danger">Click me</Button>
                  </Card.Body>
                </Link>
              </Card>
            </div>

            <div className="col-md-6 mb-3">
              {/* Second Card */}
              <Card style={{ width: "60%" }}>
                <Link to="/summarizer" className="card-link">
                  <Card.Img
                    variant="top"
                    src="https://resources.news.e.abb.com/images/2024/1/31/0/QUARTERLY_RESULTS.jpg"
                    alt="Second Card image"
                  />
                  <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Title className="text-center">
                      ABB Document Summarizer​
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-center">
                      A dedicated portal for ABB PAEN summarizer Bot that can
                      enable you chat with your document and get responses in
                      minutes​.
                    </Card.Subtitle>

                    <Button variant="danger">Click me</Button>
                  </Card.Body>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
