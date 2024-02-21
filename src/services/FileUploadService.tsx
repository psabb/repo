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

const commercialExcel = async (storedVectorStoreName: string): Promise<any> => {
  try {
    /// Make a request to the server with the vectorStoreName
    const response = await fetch(
      "https://github-backend.azurewebsites.net/commercialExcel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vectorStoreName: storedVectorStoreName,
        }),
      }
    );
    // Return the JSON data from the response
    return response;
  } catch (error: any) {
    // Handle errors that may occur during the request
    console.error("Error downloading Commercial Excel file:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};

const technicalExcel = async (storedVectorStoreName: string): Promise<any> => {
  try {
    /// Make a request to the server with the vectorStoreName
    const response = await fetch(
      "https://github-backend.azurewebsites.net/technicalExcel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vectorStoreName: storedVectorStoreName,
        }),
      }
    );
    // Return the JSON data from the response
    return response;
  } catch (error: any) {
    // Handle errors that may occur during the request
    console.error("Error downloading Technical Excel file:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};

const legalExcel = async (storedVectorStoreName: string): Promise<any> => {
  try {
    /// Make a request to the server with the vectorStoreName
    const response = await fetch(
      "https://github-backend.azurewebsites.net/legalExcel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vectorStoreName: storedVectorStoreName,
        }),
      }
    );
    // Return the JSON data from the response
    return response;
  } catch (error: any) {
    // Handle errors that may occur during the request
    console.error("Error downloading Legal Excel file:", error);
    throw error; // Re-throw the error to be caught by the calling function
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
  getFiles,
  commercialExcel,
  technicalExcel,
  legalExcel,
  clearConfig,
};

export default FileUploadService;
