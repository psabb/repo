const baseApiUrl = "https://github-backend.azurewebsites.net/";

const upload = (file: any) => {
  const formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    fetch(`${baseApiUrl}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error uploading file:", error.message);
        reject(error);
      });
  });
};

const processFile = () => {
  return new Promise((resolve, reject) => {
    fetch(`${baseApiUrl}/process`, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error processing file:", error.message);
        reject(error);
      });
  });
};

const getFiles = () => {
  return new Promise((resolve, reject) => {
    fetch(`${baseApiUrl}/files`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error fetching files:", error.message);
        reject(error);
      });
  });
};

const riskAnalysis = () => {
  return new Promise((resolve, reject) => {
    fetch(`${baseApiUrl}/risk_analysis`, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error triggering risk analysis:", error.message);
        reject(error);
      });
  });
};

const getRiskAnalysisResults = () => {
  return new Promise((resolve, reject) => {
    fetch(`${baseApiUrl}/risk_analysis`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error fetching risk analysis results:", error.message);
        reject(error);
      });
  });
};

const generateExcel = () => {
  return new Promise((resolve, reject) => {
    fetch(`${baseApiUrl}/generate_excel`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        resolve(response);
      })
      .catch((error) => {
        console.error("Error downloading Excel file:", error);
        reject(error);
      });
  });
};

const legalExcel = () => {
  return new Promise((resolve, reject) => {
    fetch(`${baseApiUrl}/generate_legal_excel`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error downloading Excel file:", error);
        reject(error);
      });
  });
};

const FileUploadService = {
  upload,
  processFile,
  getFiles,
  riskAnalysis,
  getRiskAnalysisResults,
  generateExcel,
  legalExcel,
};

export default FileUploadService;
