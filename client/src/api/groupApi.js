import axiosClient from './axiosClient';
import api from './API';
const groupApi = {
  getOne: async (payload) => {
    const url = api.GROUP + payload;
    const response = await axiosClient.get(url);
    return response.data;
  },
  newGroup: async (payload) => {
    const url = api.GROUP;
    const response = await axiosClient.post(url, payload);
    return response.data;
  },
  editGroup: async (id, payload) => {
    const url = api.GROUP + id;
    const response = await axiosClient.put(url, payload);
    return response;
  },
  addMember: async (groupId, payload) => {
    const url = api.ADD_MEMBER_GROUP + groupId;
    const response = await axiosClient.post(url, payload);
    return response;
  },

  getMember: async (groupId) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.GET_MEMBER_GROUP;
    const response = await axiosClient.post(url, groupId);
    return response.data;
  },
  approveMember: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.APPROVE_MEMBER_GROUP;
    const response = await axiosClient.post(url, payload);
    return response.data;
  },
  rejectMember: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.REJECT_MEMBER_GROUP;
    const response = await axiosClient.post(url, payload);
    return response.data;
  },
  banMember: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.BAN_MEMBER_GROUP;
    const response = await axiosClient.post(url, payload);
    return response.data;
  },
  deleteMember: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.DELETE_MEMBER_GROUP;
    const response = await axiosClient.delete(url, payload);
    return response.data;
  },
};

export default groupApi;
