import axiosClient from './axiosClient';
import api from '../api/API'
const userApi = {
  signIn: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = '/auth/login';
    const response =  axiosClient.post(url, payload);
    console.log(response);
    return response;
  },
  getFriends: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.GET_FRIENDS+payload;
    const response =  axiosClient.get(url, payload);
    console.log(response);
    return response;
  },

  getMe: async (payload) => {
    const url = '/me';
    const response = await axiosClient.get(url, payload);
    return response.data;
  },
};
  
  export default userApi;
  