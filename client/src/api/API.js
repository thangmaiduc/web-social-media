let host = window.location.host + '/api';
if (process.env.REACT_APP_API_URL) host = process.env.REACT_APP_API_URL;
const api = {
  GET_POST_TIMELINE: '/posts/timeline/',
  GET_POST_PROFILE: '/posts/profile/',
  CREATE_POST: '/posts/',
  QUERY_POSTS: '/posts/query/',

  CREATE_COMMENT: '/comments/',
  DELETE_COMMENT: '/comments/',
  EDIT_COMMENT: '/comments/',
  GET_COMMENTS: '/comments/posts/',

  GET_FRIENDS: '/users/friends/',
  GET_USER: '/users/',
  CHANGE_PASSWORD: '/users/change-password/',
  QUERY_USERS: '/users/query/',
  GET_ME: '/users/me',

  UPLOAD: '/cloudinary-upload',

  GET_CONVERSATIONS: '/conversations/',
  VIEW_CONVERSATIONS: '/conversations/view',
  ADD_MEMBER: '/conversations/members/',

  GET_MESSAGES: '/messages/',

  CREATE_MESSAGE: '/messages/',
};
export default api;
