import React, { useState, useEffect } from "react";
import SideNav, {
  Toggle,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import FileUploadService from "../../services/FileUploadService";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Result {
  question: string;
  response: string;
}

interface RiskResults {
  results: Result[];
  score: number;
  score_message: string;
  percentage_ok: any;
}

function MySideNav() {
  const [isRiskAnalysisInProgress, setRiskAnalysisInProgress] = useState(false);
  const [riskResults, setRiskResults] = useState<RiskResults | null>(null);

  const convertRiskResultsToExcel = (riskResults: RiskResults) => {
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Convert risk results to Excel data
      const sheet = XLSX.utils.json_to_sheet(riskResults.results);

      // Iterate over all cells and set text wrapping
      for (const cell in sheet) {
        if (cell !== "!ref" && cell !== "!cols" && cell !== "!rows") {
          sheet[cell].s = { wrapText: true };
        }
      }

      // Set minimum column size to 10 pixels
      for (const col in sheet) {
        if (col !== "!ref" && col !== "!rows") {
          const columnIndex = XLSX.utils.decode_cell(col).c;
          sheet["!cols"] = sheet["!cols"] || [];
          sheet["!cols"][columnIndex] = { width: 10, wpx: 10 };
        }
      }

      // Add the sheet to the workbook
      XLSX.utils.book_append_sheet(workbook, sheet, "Risk Analysis Results");

      // Generate Excel data
      const excelData = XLSX.write(workbook, {
        bookType: "xlsx",
        bookSST: false,
        type: "array",
      });

      return excelData;
    } catch (error: any) {
      console.error("Error converting risk results to Excel:", error.message);
      throw error;
    }
  };

  // const handleCommercialDownload = async () => {
  //   try {
  //     if (isRiskAnalysisInProgress) {
  //       // If risk analysis is already in progress, do nothing
  //       return;
  //     }
  //     setRiskAnalysisInProgress(true);

  //     // Show a warning toast while the download is in progress
  //     toast.warning("Download is in progress...", { autoClose: false });

  //     // Perform risk analysis and get results
  //     await FileUploadService.processfile();
  //     const response = await FileUploadService.getRiskAnalysisResults();

  //     console.log("Risk Analysis Response:", response);

  //     if (response.success) {
  //       const { results, score, score_message, percentage_ok } = response;

  //       // Update riskResults state
  //       setRiskResults({ results, score, score_message, percentage_ok });

  //       // Check if risk results are available
  //       if (results && results.length > 0) {
  //         // Convert risk results to Excel format
  //         const excelData = convertRiskResultsToExcel({
  //           results,
  //           score,
  //           score_message,
  //           percentage_ok,
  //         });

  //         // Create a Blob with the Excel data
  //         const blob = new Blob([excelData], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         });

  //         // Create a link element to trigger the download
  //         const link = document.createElement("a");
  //         link.href = window.URL.createObjectURL(blob);
  //         link.download = "Commericial_risk_analysis_results.xlsx";

  //         // Append the link to the body and trigger the click event
  //         document.body.appendChild(link);
  //         link.click();
  //       } else {
  //         // Handle the case where risk results are not available
  //         alert("No risk analysis results available for download.");
  //       }
  //     } else {
  //       console.error("Error triggering risk analysis:", response.message);
  //       // Handle error: Display a notification or alert to the user
  //     }
  //     // Close the warning toast once the download is complete
  //     toast.dismiss();
  //     // Show a success toast after a successful download
  //     toast.success("Download successful!");
  //   } catch (error) {
  //     console.error("Error:", (error as Error).message);
  //     // Handle error: Display a notification or alert to the user
  //   } finally {
  //     // Reset loading state
  //     setRiskAnalysisInProgress(false);
  //   }
  // };

  const handleTechnicalDownload = async () => {
    try {
      if (isRiskAnalysisInProgress) {
        // If risk analysis is already in progress, do nothing
        return;
      }

      setRiskAnalysisInProgress(true);
      toast.warning("Download is in progress...", { autoClose: false });

      // Make a request to the Flask backend to generate Excel and get the file as a response
      const response = await FileUploadService.generateExcel();

      console.log("Technical Report is downloading");
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

      const response = await FileUploadService.legalExcel();

      console.log("response received");
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
            {/* <NavItem eventKey="commercial" onClick={handleCommercialDownload}>
              <NavText>Commercial Report</NavText>
            </NavItem> */}
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
