import http, { AxiosResponse, AxiosProgressEvent } from "../http-common";

const upload = (
  file: File,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
): Promise<AxiosResponse<any>> => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("file", file);

    http
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      })
      .then((response: AxiosResponse<any>) => {
        resolve(response);
      })
      .catch((error) => {
        console.error("Error uploading file:", error.message);
        reject(error);
      });
  });
};

const processFile = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    http
      .post("/process")
      .then((response: AxiosResponse<any>) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error processing file:", error.message);
        reject(error);
      });
  });
};

const getFiles = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    http
      .get("/files")
      .then((response: AxiosResponse<any>) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error fetching files:", error.message);
        reject(error);
      });
  });
};

const riskAnalysis = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    http
      .post("/risk_analysis")
      .then((response: AxiosResponse<any>) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error triggering risk analysis:", error.message);
        reject(error);
      });
  });
};

const getRiskAnalysisResults = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    http
      .get("/risk_analysis")
      .then((response: AxiosResponse<any>) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error fetching risk analysis results:", error.message);
        reject(error);
      });
  });
};

const generateExcel = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    http
      .get("/generate_excel")
      .then((response: AxiosResponse<any>) => {
        resolve(response);
      })
      .catch((error) => {
        console.error("Error downloading Excel file:", error);
        reject(error);
      });
  });
};

const legalExcel = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    http
      .get("/generate_legal_excel")
      .then((response: AxiosResponse<any>) => {
        resolve(response.data);
      })
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
