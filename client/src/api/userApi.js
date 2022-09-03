import axiosClient from './axiosClient';
import api from '../api/API';
const userApi = {
  signIn: async (payload) => {
    const url = '/auth/login';
    const response = axiosClient.post(url, payload);
    return response;
  },
  register: async (payload) => {
    const url = '/auth/register';
    const response =await axiosClient.post(url, payload);
    console.log('response', response);
    return response;
  },
  forgotPassword: async (payload) => {
    const url = '/auth/forgot-password';
    const response =await axiosClient.put(url, payload);
    return response;
  },
  signInGoogle: async (payload) => {
    const url = '/auth/login/success';
    const response = axiosClient.get(url, { withCredentials: true });
    return response;
  },
  getFriends: async (payload) => {
    const url = api.GET_FRIENDS + payload;
    const response = axiosClient.get(url);
    return response;
  },
  follow: async (payload) => {
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
    console.log(payload);
    const url = api.GET_USER;
    const response = await axiosClient.put(url, payload);
    return response;
  },
  unfollow: async (payload) => {
    const url = `/users/${payload}/unfollow`;
    const response = await axiosClient.put(url);
    return response;
  },

  getUser: async (payload) => {
    const url = api.GET_USER + payload;
    const response = await axiosClient.get(url);
    return response.data;
  },
  queryUsers: async (payload) => {
    const url = api.QUERY_USERS;
    const response = await axiosClient.get(url, payload);
    return response;
  },
  getUserById: async (payload) => {
    const url = api.GET_USER + payload + '/id';
    const response = await axiosClient.get(url);
    return response.data;
  },
  changePassword: async (payload) => {
    const url = api.CHANGE_PASSWORD;
    const response = await axiosClient.put(url,payload);
    return response.message;
  },
};

export default userApi;



