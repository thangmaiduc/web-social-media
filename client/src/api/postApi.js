import axiosClient from './axiosClient';

const postApi = {
  getTimeLine: async (payload) => {
    // Cái đường dẫn API này tuỳ thuộc vào BE của bạn cho cái nào thì dùng cái đó
    const url = '/posts/timeline/';
    const response =  axiosClient.get(url, payload);
    console.log(response);
    return response;
  },

  getPostProfile: async (payload) => {
    console.log(payload);
    const url = '/posts/profile/'+payload;
    const response = await axiosClient.get(url, payload);
    return response.data;
  },
};
  
  export default postApi;
  