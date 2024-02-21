import React, { useState } from "react";
import SideNav, {
  Toggle,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import FileUploadService from "../../services/FileUploadService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MySideNavProps {
  storedVectorStoreName: string | null; // adjust the type accordingly
}

function MySideNav({ storedVectorStoreName }: MySideNavProps) {
  const [isRiskAnalysisInProgress, setRiskAnalysisInProgress] = useState(false);

  const handleCommercialDownload = async () => {
    try {
      console.log("triggered commercial download");
      toast.warning("Download is in progress...", { autoClose: false });

      const response = await FileUploadService.commercialExcel(
        storedVectorStoreName || ""
      );

      console.log("response received :", response);
      // Close the warning toast once the download is complete
      toast.dismiss();
      // Show a success toast after a successful download
      toast.success("Download successful!");
    } catch (error: any) {
      // Handle errors
      console.error("Error:", error.message);
    }
  };

  const handleTechnicalDownload = async () => {
    try {
      if (isRiskAnalysisInProgress) {
        // If risk analysis is already in progress, do nothing
        return;
      }

      setRiskAnalysisInProgress(true);
      toast.warning("Download is in progress...", { autoClose: false });

      // Make a request to the Flask backend to generate Excel and get the file as a response
      const response = await FileUploadService.technicalExcel(
        storedVectorStoreName || ""
      );

      console.log("response received :", response);
      // Close the warning toast once the download is complete
      toast.dismiss();
      // Show a success toast after a successful download
      toast.success("Download successful!");
    } catch (error: any) {
      // Handle errors
      console.error("Error:", error.message);
    } finally {
      setRiskAnalysisInProgress(false);
    }
  };

  const handleLegalDownload = async () => {
    try {
      console.log("triggered legeal");
      toast.warning("Download is in progress...", { autoClose: false });

      const response = await FileUploadService.legalExcel(
        storedVectorStoreName || ""
      );

      console.log("response received :", response);
      // Close the warning toast once the download is complete
      toast.dismiss();
      // Show a success toast after a successful download
      toast.success("Download successful!");
    } catch (error: any) {
      // Handle errors
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <SideNav onSelect={(selected: string) => {}}>
        <Toggle />
        <SideNav.Nav defaultSelected="downloads">
          <NavItem eventKey="downloads">
            <NavIcon>
              <i
                className="fa-solid fa-download"
                style={{ fontSize: "1.5em" }}
              ></i>
            </NavIcon>
            <NavText>Download Center</NavText>
            <NavItem eventKey="commercial" onClick={handleCommercialDownload}>
              <NavText>Commercial Report</NavText>
            </NavItem>
            <NavItem eventKey="Legal" onClick={handleLegalDownload}>
              <NavText>Legal Report</NavText>
            </NavItem>
            <NavItem eventKey="Technical" onClick={handleTechnicalDownload}>
              <NavText>Technical Report</NavText>
            </NavItem>
            <NavItem eventKey="General">
              <NavText>General Report</NavText>
            </NavItem>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default MySideNav;
