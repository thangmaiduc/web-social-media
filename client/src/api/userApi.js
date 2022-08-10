import axiosClient from './axiosClient';
import api from '../api/API'
const userApi = {
  signIn: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = '/auth/login';
    const response =  axiosClient.post(url, payload);
    return response;
  },
  getFriends: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.GET_FRIENDS+payload;
    const response =  axiosClient.get(url);
    return response;
  },
  follow: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url =`/users/${payload}/follow`;
    const response =await  axiosClient.put(url);
    return response;
  },
  unfollow: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url =`/users/${payload}/unfollow`;
    const response =await  axiosClient.put(url);
    return response;
  },

  getUser:  async (payload) => {
    const url = api.GET_USER+payload;
    const response = await  axiosClient.get(url);
    return response.data;
  },
  getMe:  (payload) => {
    const url = '/me';
    const response =  axiosClient.get(url, payload);
    return response.data;
  },
};
  
  export default userApi;
  