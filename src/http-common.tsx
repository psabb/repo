import axios, {
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  AxiosProgressEvent,
} from "axios";

const http = axios.create({
  baseURL: "http://0.0.0.0:5000",
  headers: {
    "Content-type": "application/json",
  },
});

export default http;
export { AxiosError };
export type { AxiosResponse, AxiosRequestConfig, AxiosProgressEvent };
