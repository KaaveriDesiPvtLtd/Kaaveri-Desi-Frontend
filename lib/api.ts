import axios from 'axios';
import { encryptData, decryptData } from './crypto-utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Encrypt outgoing data
apiClient.interceptors.request.use(
  (config) => {
    // Only encrypt for POST, PUT, PATCH if there's data and it's not already encrypted
    if (
      config.data && 
      !config.data.encryptedData && 
      ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '')
    ) {
      const encryptedStr = encryptData(config.data);
      config.data = { encryptedData: encryptedStr };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Decrypt incoming data
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.encryptedData) {
      const decryptedData = decryptData(response.data.encryptedData);
      if (decryptedData !== null) {
        response.data = decryptedData;
      }
    }
    return response;
  },
  (error) => {
    // Handling error responses that might also be encrypted
    if (error.response?.data?.encryptedData) {
      const decryptedError = decryptData(error.response.data.encryptedData);
      if (decryptedError !== null) {
        error.response.data = decryptedError;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
