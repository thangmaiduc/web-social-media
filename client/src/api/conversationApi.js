import axiosClient from './axiosClient';
import api from './API';
const conversationApi = {
  getOfUser: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.GET_CONVERSATIONS;
    const response = await axiosClient.get(url);
    // console.log('response', response);
    return response.data;
  },
  getFriends: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.GET_FRIENDS + payload;
    const response = axiosClient.get(url);
    return response;
  },

  getUser: async (payload) => {
    const url = api.GET_USER + payload;
    const response = await axiosClient.get(url);
    return response.data;
  },
  getMe: (payload) => {
    const url = '/me';
    const response = axiosClient.get(url, payload);
    return response.data;
  },
};

export default conversationApi;
