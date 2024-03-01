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
  storedVectorStoreName: string | null;
  fileUploaded: boolean;
}

function MySideNav({ storedVectorStoreName, fileUploaded }: MySideNavProps) {
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
      if (isRiskAnalysisInProgress) {
        return; // Disable download if risk analysis is in progress
      }

      setRiskAnalysisInProgress(true);
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
      toast.success(
        "Download successful, Please Check your Downloads folder!",
        { autoClose: false }
      );
    } catch (error: any) {
      // Handle errors
      console.error("Error:", error.message);
    } finally {
      setRiskAnalysisInProgress(false); // Enable downloads after completion or failure
    }
  };

  const handleTechnicalDownload = async () => {
    try {
      if (isRiskAnalysisInProgress) {
        // If risk analysis is already in progress, do nothing
        return;
      }

      setRiskAnalysisInProgress(true);
      console.log("triggered technical download");
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
      toast.success(
        "Download successful, Please Check your Downloads folder!",
        { autoClose: false }
      );
    } catch (error: any) {
      // Handle errors
      console.error("Error:", error.message);
    } finally {
      setRiskAnalysisInProgress(false); // Enable downloads after completion or failure
    }
  };

  const handleLegalDownload = async () => {
    try {
      if (isRiskAnalysisInProgress) {
        return; // Disable download if risk analysis is in progress
      }

      setRiskAnalysisInProgress(true);
      console.log("triggered legal");
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
      toast.success(
        "Download successful, Please Check your Downloads folder!",
        { autoClose: false }
      );
    } catch (error: any) {
      // Handle errors
      console.error("Error:", error.message);
    } finally {
      setRiskAnalysisInProgress(false); // Enable downloads after completion or failure
    }
  };

  const handleGeneralDownload = async () => {
    try {
      if (isRiskAnalysisInProgress) {
        return; // Disable download if risk analysis is in progress
      }

      setRiskAnalysisInProgress(true);
      console.log("triggered General download");
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
      downloadLink.download = `General_Report_${new Date().toISOString()}.xlsx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      console.log("response received :", response);
      // Close the warning toast once the download is complete
      toast.dismiss();
      // Show a success toast after a successful download
      toast.success(
        "Download successful, Please Check your Downloads folder!",
        { autoClose: false }
      );
    } catch (error: any) {
      // Handle errors
      console.error("Error:", error.message);
    } finally {
      setRiskAnalysisInProgress(false); // Enable downloads after completion or failure
    }
  };

  const handleProcurementDownload = async () => {
    try {
      if (isRiskAnalysisInProgress) {
        return; // Disable download if risk analysis is in progress
      }

      setRiskAnalysisInProgress(true);
      console.log("triggered Procurement download");
      toast.warning("Download is in progress...", { autoClose: false });

      const response = await FileUploadService.procurementExcel(
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
      downloadLink.download = `General_Report_${new Date().toISOString()}.xlsx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      console.log("response received :", response);
      // Close the warning toast once the download is complete
      toast.dismiss();
      // Show a success toast after a successful download
      toast.success(
        "Download successful, Please Check your Downloads folder!",
        { autoClose: false }
      );
    } catch (error: any) {
      // Handle errors
      console.error("Error:", error.message);
    } finally {
      setRiskAnalysisInProgress(false); // Enable downloads after completion or failure
    }
  };

  const handleDownloadClick = (downloadFunction: { (): void }) => {
    if (!isRiskAnalysisInProgress) {
      downloadFunction();
    } else {
      // Show an error toast if download is disabled
      toast.error(
        "Download is disabled. Please wait for the current download to complete."
      );
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

          {fileUploaded && (
            <NavItem eventKey="downloads">
              <NavIcon>
                <i
                  className="fa-solid fa-download"
                  style={{ fontSize: "1.5em" }}
                ></i>
              </NavIcon>
              <NavText>Download Center</NavText>

              {/* Individual Download Items */}
              <NavItem
                eventKey="commercial"
                onClick={() => handleDownloadClick(handleCommercialDownload)}
              >
                <NavText>Commercial Summary</NavText>
              </NavItem>
              <NavItem
                eventKey="Legal"
                onClick={() => handleDownloadClick(handleLegalDownload)}
              >
                <NavText>Legal Summary</NavText>
              </NavItem>
              <NavItem
                eventKey="Technical"
                onClick={() => handleDownloadClick(handleTechnicalDownload)}
              >
                <NavText>Technical Summary</NavText>
              </NavItem>
              <NavItem
                eventKey="General"
                onClick={() => handleDownloadClick(handleGeneralDownload)}
              >
                <NavText>General Summary</NavText>
              </NavItem>
              <NavItem
                eventKey="Procurement"
                onClick={() => handleDownloadClick(handleProcurementDownload)}
              >
                <NavText>Procurement Summary</NavText>
              </NavItem>
            </NavItem>
          )}
        </SideNav.Nav>
      </SideNav>
      <ToastContainer
        position="top-right"
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        style={{ marginTop: "3%" }}
      />
    </>
  );
}

export default MySideNav;
