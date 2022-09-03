const baseURL = process.env.REACT_APP_API_URL;
const api = {
  GET_POST_TIMELINE: baseURL + '/posts/timeline/',
  GET_POST_PROFILE: baseURL + '/posts/profile/',
  CREATE_POST: baseURL + '/posts/',
  QUERY_POSTS: baseURL + '/posts/query/',
  
  CREATE_COMMENT: baseURL + '/comments/',
  DELETE_COMMENT: baseURL + '/comments/',
  EDIT_COMMENT: baseURL + '/comments/',
  GET_COMMENTS: baseURL + '/comments/posts/',

  GET_FRIENDS: baseURL + '/users/friends/',
  GET_USER: baseURL + '/users/',
  CHANGE_PASSWORD: baseURL + '/users/change-password/',
  QUERY_USERS: baseURL + '/users/query/',
  GET_ME: baseURL + '/users/me',

  UPLOAD: baseURL + '/cloudinary-upload',

  GET_CONVERSATIONS: baseURL + '/conversations/',
  ADD_MEMBER: baseURL + '/conversations/members/',

  GET_MESSAGES: baseURL + '/messages/',

  CREATE_MESSAGE: baseURL + '/messages/',

  
};
export default api;