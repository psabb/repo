import http, { AxiosResponse, AxiosProgressEvent } from "../http-common";

const upload = (
  files: File[],
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
): Promise<AxiosResponse<any>> => {
  // Create FormData and append the file
  let formData = new FormData();
  files.map((file) => formData.append("files", file, `${file.name}`));

  // Send the POST request with the appropriate headers and progress callback
  return http
    .post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    })
    .catch((error) => {
      console.error("Error uploading file:", error.message);
      throw error;
    });
};

const getFiles = async (): Promise<any> => {
  try {
    const response = await http.get("/files");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching files:", error.message);
    throw error;
  }
};

const riskAnalysis = async (): Promise<any> => {
  try {
    // Send a POST request to the '/risk_analysis' endpoint on the server
    const response = await http.post("/risk_analysis");

    // Return the data received from the server
    return response.data;
  } catch (error: any) {
    // If an error occurs during the request, log the error and rethrow it
    console.error("Error triggering risk analysis:", error.message);
    throw error;
  }
};

// const fetchResponse =async (userMessage: string): Promise<any> => {
//   try {
//     // Send a POST request to the '/risk_analysis' endpoint on the server
//     const response = await http.post("/process_input",{headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ user_input: userMessage }),}
//       );

//     // Return the data received from the server
//     return response.data;
//   } catch (error: any) {
//     // If an error occurs during the request, log the error and rethrow it
//     console.error("Error triggering risk analysis:", error.message);
//     throw error;
//   }
// };

const getRiskAnalysisResults = async (): Promise<any> => {
  try {
    const response = await http.get("/risk_analysis");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching risk analysis results:", error.message);
    throw error;
  }
};

const generateExcel = async (): Promise<any> => {
  try {
    // Make a GET request to the "/generate_excel" endpoint
    const response = await http.get("/generate_excel");

    // Return the JSON data from the response
    return response;
  } catch (error: any) {
    // Handle errors that may occur during the request
    console.error("Error downloading Excel file:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};

const legalExcel = async (): Promise<any> => {
  try {
    // Make a GET request to the "/generate_legal_excel" endpoint
    const response = await http.get("/generate_legal_excel");

    // Return the JSON data from the response
    return response.data;
  } catch (error: any) {
    // Handle errors that may occur during the request
    console.error("Error downloading Excel file:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};

const processfile = async (blobName: string): Promise<any> => {
  try {
    const response = await http.get(`/processfile/${blobName}`);
    return response;
  } catch (error: any) {
    if (error.response) {
      console.error(
        "Server responded with error status:",
        error.response.status
      );
    } else if (error.request) {
      console.error("No response received from the server");
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};

const clearConfig = async (): Promise<any> => {
  try {
    // Make a GET request to the "/generate_legal_excel" endpoint
    const response = await http.post("/clear_config");
  } catch (error: any) {
    // Handle errors that may occur during the request
    console.error("error clearing console:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};

const FileUploadService = {
  upload,
  processfile,
  getFiles,
  riskAnalysis,
  // fetchResponse,
  getRiskAnalysisResults,
  generateExcel,
  legalExcel,
  clearConfig,
};

export default FileUploadService;
