let host = window.location.host + '/api';
if (process.env.REACT_APP_API_URL) host = process.env.REACT_APP_API_URL;

const api = {
  GET_POST_TIMELINE: '/posts/timeline/',
  GET_POST_PROFILE: '/posts/profile/',
  CREATE_POST: '/posts/',

  GET_FRIENDS: '/users/friends/',
  GET_USER: '/users/',
  GET_ME: '/users/me',

  UPLOAD: '/cloudinary-upload',

  GET_CONVERSATIONS: '/conversations/',
  ADD_MEMBER: '/conversations/members/',

  GET_MESSAGES: '/messages/',

  CREATE_MESSAGE: '/messages/',

  GET_POST_ADMIN: '/admin/posts/',
  GET_DASHBOARD_ADMIN: '/admin/dashboard/',

  GET_USER_ADMIN: '/admin/users/',

  BLOCK_USER: '/admin/block-user/',
  BLOCK_POST: '/admin/block-posts/',
};
export default api;
