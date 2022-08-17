import axiosClient from './axiosClient';
import api from '../api/API'
const userApi = {
  signIn: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = '/auth/admin/login';
    const response =  axiosClient.post(url, payload);
    return response;
  },
  getFriends: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.GET_FRIENDS+payload;
    const response =  axiosClient.get(url);
    return response;
  },

  getUser:  async (payload) => {
    const url = api.GET_USER+payload;
    const response = await  axiosClient.get(url);
    return response.data;
  },
  getUserAdmin: async (payload) => {
    const url =api.GET_USER_ADMIN;
    const response =await axiosClient.get(url, {params:payload});
    return response;
  },
  blockUser: async (payload) => {
    const url =api.BLOCK_USER;
    const response =  axiosClient.patch(url, payload);
    return response;
  },
};
  
  export default userApi;
  