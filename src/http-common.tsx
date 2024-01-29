import axios, {
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  AxiosProgressEvent,
} from "axios";

const http = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-type": "application/json",
  },
});

export default http;
export { AxiosError };
export type { AxiosResponse, AxiosRequestConfig, AxiosProgressEvent };
