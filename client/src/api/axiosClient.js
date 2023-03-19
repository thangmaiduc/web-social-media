// api/axiosClient.js
import axios from 'axios';
import queryString from 'query-string';
import { notify } from '../utility/toast';
let host = '/api';
if (process.env.REACT_APP_API_URL) host = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({
  baseURL: host,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
  const customHeaders = {};
  const accessToken = localStorage.getItem('token');
  if (accessToken) {
    customHeaders.Authorization = accessToken;
  }
  return {
    ...config,
    headers: {
      ...customHeaders, // auto attach token
      ...config.headers, // but you can override for some requests
    },
  };
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const { response } = error;
    console.log(error.response);
    console.log(process.env.REACT_APP_API_URL);
    if (!response) {
      notify('Server đã xảy ra sự cố, vui lòng báo admin,');
      throw error;
    }
    const { status } = response;
    if (!status) notify('Server đã xảy ra sự cố, vui lòng báo admin');
    if (status === 401) {
      notify(response.data.message);
    }
    if (status === 400) {
      notify(response.data.message);
    }
    if (status === 417) {
      localStorage.clear();
      // window.location.reload();
    }

    throw error;
  }
);
export default axiosClient;
