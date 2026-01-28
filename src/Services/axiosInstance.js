import axios from "axios";

const pendingRequests = new Map();

const axiosInstance = axios.create({
  baseURL: "http://10.238.148.12:8080",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

const getRequestKey = (config) => {
  return `${config.method}-${config.url}`;
};

axiosInstance.interceptors.request.use((config) => {
  const requestKey = getRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    const cancelToken = pendingRequests.get(requestKey);
    cancelToken.cancel("Duplicate request canceled");
  }
  const cancelToken = axios.CancelToken.source();
  config.cancelToken = cancelToken.token;
  pendingRequests.set(requestKey, cancelToken);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const requestKey = getRequestKey(response.config);
    pendingRequests.delete(requestKey);
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.resolve();
    } else {
      const requestKey = getRequestKey(error.config);
      pendingRequests.delete(requestKey);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
