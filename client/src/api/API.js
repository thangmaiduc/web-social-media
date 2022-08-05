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
};
export default api;