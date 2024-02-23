import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const wasPageReloaded = window.performance.navigation.type === 1;

    if (wasPageReloaded) {
      // Display a toast notification after the page is reloaded
      toast.success("New Chat Created", { autoClose: 3000 });
    }
  }, []);

  // Use handleNewChat to initiate the reload
  const handleNewChat = () => {
    try {
      // Reload the page
      window.location.reload();
    } catch (error: any) {
      // Handle errors if needed
      console.error("Error:", error.message);
    }
  };

  const handleCommercialDownload = async () => {
    try {
      console.log("triggered commercial download");
      toast.warning("Download is in progress...", { autoClose: false });

      const response = await FileUploadService.commercialExcel(
        storedVectorStoreName || ""
      );

      console.log("response received :", response.data);

      // Extract the blob name from the response
      const receivedBlobName = response.data.blob_name;

      // Log the blob name for verification
      console.log("blobName:", receivedBlobName);

      // Construct the download URL or use it in any way you need
      const downloadUrl = `https://rfqdocumentstorage.blob.core.windows.net/rfq-downloads/${receivedBlobName}`;

      // Use the fetch API to download the file
      const responseBlob = await fetch(downloadUrl);
      const blobData = await responseBlob.blob();

      // Create a download link and trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blobData);
      downloadLink.download = `Commercial_Report_${new Date().toISOString()}.xlsx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

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

      console.log("response received :", response.data);

      // Extract the blob name from the response
      const receivedBlobName = response.data.blob_name;

      // Log the blob name for verification
      console.log("blobName:", receivedBlobName);

      // Construct the download URL or use it in any way you need
      const downloadUrl = `https://rfqdocumentstorage.blob.core.windows.net/rfq-downloads/${receivedBlobName}`;

      // Use the fetch API to download the file
      const responseBlob = await fetch(downloadUrl);
      const blobData = await responseBlob.blob();

      // Create a download link and trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blobData);
      downloadLink.download = `Technical_Report_${new Date().toISOString()}.xlsx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

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

  const handleLegalDownload = async () => {
    try {
      console.log("triggered legeal");
      toast.warning("Download is in progress...", { autoClose: false });

      const response = await FileUploadService.legalExcel(
        storedVectorStoreName || ""
      );

      console.log("response received :", response.data);

      // Extract the blob name from the response
      const receivedBlobName = response.data.blob_name;

      // Log the blob name for verification
      console.log("blobName:", receivedBlobName);

      // Construct the download URL or use it in any way you need
      const downloadUrl = `https://rfqdocumentstorage.blob.core.windows.net/rfq-downloads/${receivedBlobName}`;

      // Use the fetch API to download the file
      const responseBlob = await fetch(downloadUrl);
      const blobData = await responseBlob.blob();

      // Create a download link and trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blobData);
      downloadLink.download = `Legal_Report_${new Date().toISOString()}.xlsx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

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

  const handleGeneralDownload = async () => {
    try {
      console.log("triggered legeal");
      toast.warning("Download is in progress...", { autoClose: false });

      const response = await FileUploadService.generalExcel(
        storedVectorStoreName || ""
      );

      console.log("response received :", response.data);

      // Extract the blob name from the response
      const receivedBlobName = response.data.blob_name;

      // Log the blob name for verification
      console.log("blobName:", receivedBlobName);

      // Construct the download URL or use it in any way you need
      const downloadUrl = `https://rfqdocumentstorage.blob.core.windows.net/rfq-downloads/${receivedBlobName}`;

      // Use the fetch API to download the file
      const responseBlob = await fetch(downloadUrl);
      const blobData = await responseBlob.blob();

      // Create a download link and trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blobData);
      downloadLink.download = `Legal_Report_${new Date().toISOString()}.xlsx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

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

        <SideNav.Nav>
          <NavItem eventKey="New Chat" onClick={handleNewChat}>
            <NavIcon>
              <i className="fa-solid fa-plus" style={{ fontSize: "1.5em" }}></i>
            </NavIcon>
            <NavText>New Chat</NavText>
          </NavItem>
        </SideNav.Nav>

        <SideNav.Nav>
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
            <NavItem eventKey="General" onClick={handleGeneralDownload}>
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
