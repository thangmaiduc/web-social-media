import axiosClient from './axiosClient';
import api from './API'
const postApi = {
  getTimeLine: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = '/posts/timeline/';
    const response =  axiosClient.get(url, payload);
    return response;
  },
  createPost: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = api.CREATE_POST;
    const response =await  axiosClient.post(url, payload);
    return response.data;
  },

  getPostProfile: async (payload) => {
    console.log(payload);
    const url = '/posts/profile/'+payload;
    const response = await axiosClient.get(url, payload);
    return response.data;
  },

  getComments: async (payload) => {
    console.log(payload);
    const url = api.GET_COMMENTS;
    const response = await axiosClient.get(url, payload);
    return response.data;
  },
  createComment: async (payload) => {
    console.log(payload);
    const url = api.CREATE_COMMENT;
    const response = await axiosClient.post(url, payload);
    return response.data;
  },
  editCommnet: async (commentId,payload) => {
    console.log(payload);
    const url = api.EDIT_COMMENT+commentId;
    const response = await axiosClient.post(url, payload);
    return response.data;
  },
  
};
  
  export default postApi;
  