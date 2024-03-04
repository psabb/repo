// FileUploadService.ts
import * as UploadService from "./commonservice";
import * as ExcelServices from "./excel-services";

const FileUploadService = {
  upload: UploadService.upload,
  getFiles: UploadService.getFiles,
  clearConfig: UploadService.clearConfig,
  commercialExcel: ExcelServices.commercialExcel,
  technicalExcel: ExcelServices.technicalExcel,
  legalExcel: ExcelServices.legalExcel,
  generalExcel: ExcelServices.generalExcel,
  procurementExcel: ExcelServices.procurementExcel,
};

export default FileUploadService;
