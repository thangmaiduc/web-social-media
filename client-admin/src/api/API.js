const baseURL = process.env.REACT_APP_API_URL;
const api = {
  GET_POST_TIMELINE: baseURL + '/posts/timeline/',
  GET_POST_PROFILE: baseURL + '/posts/profile/',
  CREATE_POST: baseURL + '/posts/',

  GET_FRIENDS: baseURL + '/users/friends/',
  GET_USER: baseURL + '/users/',
  GET_ME: baseURL + '/users/me',

  UPLOAD: baseURL + '/cloudinary-upload',

  GET_CONVERSATIONS: baseURL + '/conversations/',
  ADD_MEMBER: baseURL + '/conversations/members/',

  GET_MESSAGES: baseURL + '/messages/',

  CREATE_MESSAGE: baseURL + '/messages/',

  GET_POST_ADMIN: baseURL + '/admin/posts/',
  GET_DASHBOARD_ADMIN: baseURL + '/admin/dashboard/',

  GET_USER_ADMIN: baseURL + '/admin/users/',

  BLOCK_USER: baseURL + '/admin/block-user/',
  BLOCK_POST: baseURL + '/admin/block-posts/'


};
export default api;