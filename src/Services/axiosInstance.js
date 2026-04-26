import axios from 'axios';

const pendingRequests = new Map();

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const getRequestKey = (config) => `${config.method}-${config.url}`;

axiosInstance.interceptors.request.use((config) => {
  const requestKey = getRequestKey(config);
  const controller = pendingRequests.get(requestKey);
  if (controller) controller.abort();

  const newController = new AbortController();
  config.signal = newController.signal;
  pendingRequests.set(requestKey, newController);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    pendingRequests.delete(getRequestKey(response.config));
    return response;
  },
  (error) => {
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      return Promise.reject(error);
    }
    const key = error.config ? getRequestKey(error.config) : null;
    if (key) pendingRequests.delete(key);
    return Promise.reject(error);
  }
);

export default axiosInstance;
