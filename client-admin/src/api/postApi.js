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
  getPostAdmin: async (payload) => {
    console.log(payload);
    const url = api.GET_POST_ADMIN;
    const response = await axiosClient.get(url, {params:payload});
    return response;
  },
  getDashboardAdmin: async (payload) => {
    console.log(payload);
    const url = api.GET_DASHBOARD_ADMIN;
    const response = await axiosClient.get(url);
    return response.data;
  },
  blockPost: async (payload) => {
    const url = api.BLOCK_POST;
    const response =  axiosClient.patch(url, payload);
    return response;
  },
};
  
  export default postApi;
  