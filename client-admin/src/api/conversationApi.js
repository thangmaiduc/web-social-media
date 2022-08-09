import axiosClient from './axiosClient';
import api from './API';
const conversationApi = {
  getOfUser: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.GET_CONVERSATIONS;
    const response = await axiosClient.get(url);
    console.log('response', response);
    return response.data;
  },
  getMessage: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.GET_MESSAGES+payload;
    const response = await axiosClient.get(url);
    console.log('response', response);
    return response.data;
  },
  newMessage: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.CREATE_MESSAGE;
    const response = await axiosClient.post(url, payload);
    console.log('response', response);
    return response.data;
  },
  
};

export default conversationApi;
