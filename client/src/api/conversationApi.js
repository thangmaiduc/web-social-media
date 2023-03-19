import axiosClient from './axiosClient';
import api from './API';
const conversationApi = {
  getOfUser: async (payload) => {
    const url = api.GET_CONVERSATIONS;
    const response = await axiosClient.get(url,payload );
    return response.data;
  },
  newConversation: async (payload) => {
    const url = api.GET_CONVERSATIONS;
    const response = await axiosClient.post(url,payload);
    return response;
  },
  editConversation: async (conversationId,payload) => {
    const url = api.GET_CONVERSATIONS+conversationId;
    const response = await axiosClient.put(url,payload);
    return response;
  },
  addMember: async (conversationId, payload) => {
    const url = api.ADD_MEMBER+conversationId;
    const response = await axiosClient.post(url,payload);
    return response;
  },
  getMessage: async (conversationId,payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.GET_MESSAGES+conversationId;
    const response = await axiosClient.get(url, payload);
    return response;
  },
  getMember: async (conversationId) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.ADD_MEMBER+conversationId;
    const response = await axiosClient.get(url);
    return response.data;
  },
  newMessage: async (payload) => {
    const url = api.CREATE_MESSAGE;
    const response = await axiosClient.post(url, payload);
    return response.data;
  },
  
};

export default conversationApi;
