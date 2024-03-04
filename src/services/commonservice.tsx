import http, { AxiosResponse, AxiosProgressEvent } from "../http-common";

const upload = (
  files: File[],
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
): Promise<AxiosResponse<any>> => {
  let formData = new FormData();
  files.map((file) => formData.append("files", file, `${file.name}`));

  return http
    .post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    })
    .catch((error) => {
      handleError(error);
      return Promise.reject(error); // Ensure to return a rejected promise
    });
};

const getFiles = async (): Promise<any> => {
  try {
    const response = await http.get("/files");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const clearConfig = async (): Promise<any> => {
  try {
    const response = await http.post("/clear_config");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error: any): void => {
  console.error("Error:", error.message);
  throw error;
};

export { upload, getFiles, clearConfig, handleError };
