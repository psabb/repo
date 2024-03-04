// excel-services.ts
const handleError = (error: any): void => {
  console.error("Error:", error.message);
  throw error;
};

const fetchExcelFile = async (
  endpoint: string,
  storedVectorStoreName: string
): Promise<any> => {
  try {
    const response = await fetch(
      `https://rfqbackenddeployment.azurewebsites.net/${endpoint}`,
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

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    if (!responseData || !responseData.blob_name) {
      throw new Error("Invalid server response. Missing 'blob_name'.");
    }

    const blobName = responseData.blob_name;

    return { data: responseData, blobName };
  } catch (error) {
    handleError(error);
  }
};

const commercialExcel = async (storedVectorStoreName: string): Promise<any> => {
  return fetchExcelFile("commercialExcel", storedVectorStoreName);
};

const technicalExcel = async (storedVectorStoreName: string): Promise<any> => {
  return fetchExcelFile("technicalExcel", storedVectorStoreName);
};

const legalExcel = async (storedVectorStoreName: string): Promise<any> => {
  return fetchExcelFile("legalExcel", storedVectorStoreName);
};

const generalExcel = async (storedVectorStoreName: string): Promise<any> => {
  return fetchExcelFile("generalExcel", storedVectorStoreName);
};

const procurementExcel = async (
  storedVectorStoreName: string
): Promise<any> => {
  return fetchExcelFile("procurementExcel", storedVectorStoreName);
};

export {
  commercialExcel,
  technicalExcel,
  legalExcel,
  generalExcel,
  procurementExcel,
};
