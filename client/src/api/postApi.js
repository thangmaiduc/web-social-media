import axiosClient from './axiosClient';
import api from './API';
const postApi = {
  getTimeLine: async (params) => {
    const url = '/posts/timeline/';
    const response = axiosClient.get(url, {params});
    return response;
  },
  createPost: async (payload) => {
    const url = api.CREATE_POST;
    const response = await axiosClient.post(url, payload);
    return response.data;
  },
  editPost: async (postId,payload) => {
    const url = api.CREATE_POST+postId;
    const response = await axiosClient.put(url, payload);
    return response;
  },

  getPostProfile: async (payload) => {
    const url = '/posts/profile/' + payload;
    const response = await axiosClient.get(url, payload);
    return response.data;
  },
  reportPost: async (payload) => {
    const url = `posts/${payload}/report` ;
    const response = await axiosClient.put(url);
    return response.message;
  },
  likePost: async (payload) => {
    const url = `posts/${payload}/like` ;
    const response = await axiosClient.put(url);
    return response.message;
  },
  getLikePost: async (payload) => {
    const url = `posts/${payload}/like` ;
    const response = await axiosClient.get(url);
    return response;
  },

  getComments: async (payload) => {
    const url = api.GET_COMMENTS + payload.postId;
    const response = await axiosClient.get(url, {
      params: payload.params,
    });
    return response;
  },
  createComment: async (payload) => {
    const url = api.CREATE_COMMENT;
    const response = await axiosClient.post(url, payload);
    return response.data;
  },
  editComment: async (commentId, payload) => {
    const url = api.EDIT_COMMENT + commentId;
    const response = await axiosClient.put(url, payload);
    return response.data;
  },
  deleteComment: async (commentId) => {
    const url = api.EDIT_COMMENT + commentId;
    const response = await axiosClient.delete(url);
    return response.data;
  },
  deletePost: async (payload) => {
    const url = api.CREATE_POST + payload;
    const response = await axiosClient.delete(url);
    return response;
  },
};

export default postApi;
