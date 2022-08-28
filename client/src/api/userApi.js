import axiosClient from './axiosClient';
import api from '../api/API';
const userApi = {
  signIn: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = '/auth/login';
    const response = axiosClient.post(url, payload);
    return response;
  },
  register: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = '/auth/register';
    const response = axiosClient.post(url, payload);
    return response;
  },
  forgotPassword: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    console.log(payload);
    const url = '/auth/forgot-password';
    const response =await axiosClient.put(url, payload);
    return response;
  },
  signInGoogle: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = '/auth/login/success';
    const response = axiosClient.get(url, { withCredentials: true });
    return response;
  },
  getFriends: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.GET_FRIENDS + payload;
    const response = axiosClient.get(url);
    return response;
  },
  follow: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    try {
      const url = `/users/${payload}/follow`;
      const response = await axiosClient.put(url);
      return response;
    } catch (error) {
      console.log('error.message',error.message);
      return error.message
    }
  },
  updateUser: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    console.log(payload);
    const url = api.GET_USER;
    const response = await axiosClient.put(url, payload);
    return response;
  },
  unfollow: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = `/users/${payload}/unfollow`;
    const response = await axiosClient.put(url);
    return response;
  },

  getUser: async (payload) => {
    const url = api.GET_USER + payload;
    const response = await axiosClient.get(url);
    return response.data;
  },
  getUserById: async (payload) => {
    const url = api.GET_USER + payload + '/id';
    const response = await axiosClient.get(url);
    return response.data;
  },
  getMe: (payload) => {
    const url = '/me';
    const response = axiosClient.get(url, payload);
    return response.data;
  },
};

export default userApi;
