import axios, {
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  AxiosProgressEvent,
} from "axios";

const http = axios.create({
  baseURL: "https://github-backend.azurewebsites.net",
  headers: {
    "Content-type": "application/json",
  },
});

export default http;
export { AxiosError };
export type { AxiosResponse, AxiosRequestConfig, AxiosProgressEvent };
